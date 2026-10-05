import type { APIRoute } from "astro";

const EXCLUDED_REPOS = [".github", "wattnet.eu", "wattnet-brand"];

const GITHUB_USERNAME = "wattnet";
const GITHUB_API_URL = `https://api.github.com/users/${GITHUB_USERNAME}/repos`;
const CACHE_DURATION_MS = 5 * 60 * 1000;

let cache: { timestamp: number; data: any } | null = null;

const TIMEOUT_MS = 4000;

async function fetchLatestRelease(
	repo: string,
	headers: Record<string, string>
): Promise<{ tag: string; url: string } | null> {
	try {
		const res = await fetch(
			`https://api.github.com/repos/${GITHUB_USERNAME}/${repo}/releases/latest`,
			{ headers, signal: AbortSignal.timeout(TIMEOUT_MS) }
		);
		if (!res.ok) return null;
		const data = await res.json();
		return { tag: data.tag_name, url: data.html_url };
	} catch {
		return null;
	}
}

async function checkPyPI(name: string): Promise<{ url: string; downloads: number | null } | null> {
	const PEPY_API_KEY = import.meta.env.PEPY_API_KEY;
	try {
		const pepyHeaders: Record<string, string> = {};
		if (PEPY_API_KEY) pepyHeaders["X-Api-Key"] = PEPY_API_KEY;

		const [pkgRes, pepyRes] = await Promise.all([
			fetch(`https://pypi.org/pypi/${name}/json`, { signal: AbortSignal.timeout(TIMEOUT_MS) }),
			fetch(`https://api.pepy.tech/api/v2/projects/${name}`, {
				headers: pepyHeaders,
				signal: AbortSignal.timeout(TIMEOUT_MS),
			}),
		]);
		if (!pkgRes.ok) return null;
		const downloads = pepyRes.ok ? ((await pepyRes.json()).total_downloads ?? null) : null;
		return { url: `https://pypi.org/project/${name}`, downloads };
	} catch {
		return null;
	}
}

async function checkDockerHub(name: string): Promise<{ url: string; pulls: number | null } | null> {
	try {
		const res = await fetch(
			`https://hub.docker.com/v2/repositories/${GITHUB_USERNAME}/${name}/`,
			{ signal: AbortSignal.timeout(TIMEOUT_MS) }
		);
		if (!res.ok) return null;
		const data = await res.json();
		return {
			url: `https://hub.docker.com/r/${GITHUB_USERNAME}/${name}`,
			pulls: typeof data.pull_count === "number" ? data.pull_count : null,
		};
	} catch {
		return null;
	}
}

async function fetchOpenPRs(
	repo: string,
	headers: Record<string, string>
): Promise<number> {
	try {
		const res = await fetch(
			`https://api.github.com/repos/${GITHUB_USERNAME}/${repo}/pulls?state=open&per_page=100`,
			{ headers, signal: AbortSignal.timeout(TIMEOUT_MS) }
		);
		if (!res.ok) return 0;
		const data = await res.json();
		return Array.isArray(data) ? data.length : 0;
	} catch {
		return 0;
	}
}

// Requires PACKAGES_TOKEN with read:packages scope.
// Returns null (no button shown) if token is absent or package doesn't exist.
async function checkGHCR(
	name: string,
	headers: Record<string, string>
): Promise<string | null> {
	try {
		const res = await fetch(
			`https://api.github.com/orgs/${GITHUB_USERNAME}/packages/container/${name}`,
			{ headers, signal: AbortSignal.timeout(TIMEOUT_MS) }
		);
		return res.ok ? `https://ghcr.io/${GITHUB_USERNAME}/${name}` : null;
	} catch {
		return null;
	}
}

const WATCHED_WORKFLOWS = ["CI Publish", "Release Please"];

type WorkflowStatus = "success" | "failure" | "in_progress" | "queued" | "cancelled" | "skipped" | null;

async function fetchWorkflowStatuses(
	repo: string,
	headers: Record<string, string>
): Promise<{ name: string; status: WorkflowStatus; url: string }[]> {
	try {
		const res = await fetch(
			`https://api.github.com/repos/${GITHUB_USERNAME}/${repo}/actions/workflows`,
			{ headers, signal: AbortSignal.timeout(TIMEOUT_MS) }
		);
		if (!res.ok) return [];
		const data = await res.json();
		const workflows: any[] = data.workflows ?? [];

		const matched = workflows.filter((w) =>
			WATCHED_WORKFLOWS.some((name) =>
				w.name.toLowerCase().includes(name.toLowerCase())
			)
		);

		return Promise.all(
			matched.map(async (w) => {
				const runRes = await fetch(
					`https://api.github.com/repos/${GITHUB_USERNAME}/${repo}/actions/workflows/${w.id}/runs?per_page=1`,
					{ headers, signal: AbortSignal.timeout(TIMEOUT_MS) }
				);
				if (!runRes.ok) return { name: w.name, status: null as WorkflowStatus, url: w.html_url };
				const runData = await runRes.json();
				const run = runData.workflow_runs?.[0];
				if (!run) return { name: w.name, status: null as WorkflowStatus, url: w.html_url };
				const status: WorkflowStatus =
					run.status === "completed" ? run.conclusion : run.status;
				return { name: w.name, status, url: run.html_url ?? w.html_url };
			})
		);
	} catch {
		return [];
	}
}

async function fetchCodecovCoverage(repo: string): Promise<number | null> {
	try {
		const res = await fetch(
			`https://codecov.io/api/v2/github/${GITHUB_USERNAME}/repos/${repo}/`,
			{ signal: AbortSignal.timeout(TIMEOUT_MS) }
		);
		if (!res.ok) return null;
		const data = await res.json();
		const cov = data?.totals?.coverage;
		return typeof cov === "number" ? Math.round(cov * 10) / 10 : null;
	} catch {
		return null;
	}
}

export const GET: APIRoute = async () => {
	const PACKAGES_TOKEN = import.meta.env.PACKAGES_TOKEN;

	if (cache && Date.now() - cache.timestamp < CACHE_DURATION_MS) {
		return new Response(JSON.stringify(cache.data), {
			headers: { "Content-Type": "application/json" },
		});
	}

	try {
		const ghHeaders: Record<string, string> = {
			Accept: "application/vnd.github+json",
		};
		if (PACKAGES_TOKEN) ghHeaders.Authorization = `token ${PACKAGES_TOKEN}`;

		const res = await fetch(`${GITHUB_API_URL}?per_page=100&sort=updated`, {
			headers: ghHeaders,
		});

		if (!res.ok) throw new Error(`GitHub API error ${res.status}`);

		const data = await res.json();
		const filtered = data.filter((r: any) => !EXCLUDED_REPOS.includes(r.name));

		const repos = await Promise.all(
			filtered.map(async (r: any) => {
				const [latest_release, open_prs, pypi, dockerhub, ghcr, coverage, workflows] = await Promise.all([
					fetchLatestRelease(r.name, ghHeaders),
					fetchOpenPRs(r.name, ghHeaders),
					checkPyPI(r.name),
					checkDockerHub(r.name),
					PACKAGES_TOKEN ? checkGHCR(r.name, ghHeaders) : Promise.resolve(null),
					fetchCodecovCoverage(r.name),
					fetchWorkflowStatuses(r.name, ghHeaders),
				]);

				const links: Record<string, string> = {};
				if (pypi) links.pypi = pypi.url;
				if (ghcr) links.ghcr = ghcr;
				if (dockerhub) links.dockerhub = dockerhub.url;

				const downloads =
					(pypi?.downloads ?? 0) + (dockerhub?.pulls ?? 0) || null;

				return {
					id: r.id,
					name: r.name,
					description: r.description,
					html_url: r.html_url,
					stargazers_count: r.stargazers_count,
					forks_count: r.forks_count,
					open_issues_count: r.open_issues_count,
					language: r.language,
					license: r.license ? { name: r.license.name } : null,
					pushed_at: r.pushed_at,
					topics: r.topics || [],
					owner: { avatar_url: r.owner.avatar_url },
					archived: r.archived ?? false,
					open_prs,
					latest_release: latest_release ?? null,
					coverage: coverage ?? null,
					downloads,
					workflows: workflows.length > 0 ? workflows : null,
					links: Object.keys(links).length > 0 ? links : null,
				};
			})
		);

		cache = { timestamp: Date.now(), data: repos };

		return new Response(JSON.stringify(repos), {
			headers: { "Content-Type": "application/json" },
		});
	} catch (err) {
		return new Response(JSON.stringify({ error: (err as Error).message }), {
			status: 500,
			headers: { "Content-Type": "application/json" },
		});
	}
};
