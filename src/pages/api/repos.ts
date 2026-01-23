import type { APIRoute } from "astro";

const EXCLUDED_REPOS = [".github", "wattnet.eu", "wattnet-brand"];

const GITHUB_USERNAME = "wattnet";
const GITHUB_API_URL = `https://api.github.com/users/${GITHUB_USERNAME}/repos`;
const CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minutos

// Cache simple en memoria
let cache: { timestamp: number; data: any } | null = null;

export const GET: APIRoute = async () => {
	const GITHUB_TOKEN = import.meta.env.GITHUB_TOKEN;

	// Si hay cache válida, devolverla
	if (cache && Date.now() - cache.timestamp < CACHE_DURATION_MS) {
		return new Response(JSON.stringify(cache.data), {
			headers: { "Content-Type": "application/json" },
		});
	}

	try {
		const headers = GITHUB_TOKEN ? { Authorization: `token ${GITHUB_TOKEN}` } : undefined;

		const res = await fetch(`${GITHUB_API_URL}?per_page=100&sort=updated`, { headers });

		if (!res.ok) {
			throw new Error(`GitHub API error ${res.status}`);
		}

		const data = await res.json();

		const filtered = data.filter((r: any) => !EXCLUDED_REPOS.includes(r.name));

		const repos = filtered.map((r: any) => ({
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
		}));

		// Guardar en cache
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
