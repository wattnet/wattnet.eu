import { useEffect, useState } from "preact/hooks";
import {
	Star,
	GitFork,
	AlertCircle,
	GitPullRequestArrow,
	Code,
	Scale,
	Calendar,
	ExternalLink,
	Tag,
	Container,
	ShieldCheck,
	ShieldX,
	Shield,
	Download,
} from "lucide-preact";

interface Repo {
	id: number;
	name: string;
	description: string | null;
	html_url: string;
	stargazers_count: number;
	forks_count: number;
	open_issues_count: number;
	language: string | null;
	license: { name: string } | null;
	pushed_at: string;
	topics: string[];
	owner: { avatar_url: string };
	open_prs?: number;
	archived: boolean;
	latest_release: { tag: string; url: string } | null;
	coverage: number | null;
	downloads: number | null;
	workflows: { name: string; status: string | null; url: string }[] | null;
	links: { pypi?: string; dockerhub?: string; ghcr?: string } | null;
}

function formatDownloads(n: number): string {
	if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
	if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
	return String(n);
}

function formatUpdatedDate(date: string): string {
	return `Updated on ${new Date(date).toLocaleDateString("en-US", {
		month: "short",
		day: "2-digit",
		year: "numeric",
	})}`;
}

function WorkflowBadge({ name, status, url }: { name: string; status: string | null; url: string }) {
	const cfg =
		status === "success"
			? { icon: <ShieldCheck size={15} />, cls: "text-emerald-600 dark:text-emerald-400", label: "passing" }
			: status === "failure" || status === "timed_out" || status === "action_required"
			? { icon: <ShieldX size={15} />, cls: "text-red-600 dark:text-red-400", label: "failing" }
			: { icon: <Shield size={15} />, cls: "text-gray-400 dark:text-gray-500", label: status ?? "unknown" };

	const shortName = name.replace(/CI Publish/i, "CI").replace(/Release Please/i, "Release");

	return (
		<a
			href={url}
			target="_blank"
			title={`${name}: ${cfg.label}`}
			className="flex items-center gap-1 hover:underline hover:underline-offset-2"
		>
			<span className={cfg.cls}>{cfg.icon}</span>
			<span>{shortName}</span>
		</a>
	);
}

function GitHubIcon() {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
			<path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.11.82-.26.82-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.386-1.334-1.754-1.334-1.754-1.09-.745.082-.729.082-.729 1.205.084 1.84 1.24 1.84 1.24 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.304.76-1.604-2.665-.305-5.466-1.332-5.466-5.931 0-1.31.47-2.38 1.235-3.22-.124-.303-.535-1.524.117-3.176 0 0 1.007-.322 3.3 1.23a11.52 11.52 0 013-.404c1.02.005 2.045.137 3 .404 2.29-1.552 3.296-1.23 3.296-1.23.653 1.653.242 2.874.118 3.176.77.84 1.233 1.91 1.233 3.22 0 4.61-2.804 5.625-5.475 5.921.43.372.815 1.106.815 2.228v3.293c0 .32.218.694.825.576C20.565 21.796 24 17.3 24 12c0-6.63-5.373-12-12-12z" />
		</svg>
	);
}

function PyPIIcon() {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
			<path d="M11.984 0C5.82 0 6.2 2.656 6.2 2.656l.007 2.752h5.882v.826H3.912S0 5.789 0 12.013c0 6.224 3.43 6.003 3.43 6.003h2.047v-2.887s-.11-3.43 3.375-3.43h5.821s3.265.053 3.265-3.153V3.292S18.463 0 11.984 0zM8.705 1.9a1.057 1.057 0 110 2.115 1.057 1.057 0 010-2.115z" />
			<path d="M12.016 24c6.164 0 5.784-2.656 5.784-2.656l-.007-2.752h-5.882v-.826h8.177S24 18.211 24 11.987c0-6.224-3.43-6.003-3.43-6.003h-2.047v2.887s.11 3.43-3.375 3.43H9.327s-3.265-.053-3.265 3.153v5.254S5.537 24 12.016 24zm3.279-1.9a1.057 1.057 0 110-2.115 1.057 1.057 0 010 2.115z" />
		</svg>
	);
}

function CodecovIcon() {
	return (
		<svg className="w-4 h-4 shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
			<path d="M256.57 12C115.171 12 0 125.753 0 264.531v1.138l43.332 25.025h1.14c27.367-18.199 60.437-25.025 93.506-19.338 22.806 4.55 44.471 14.788 61.576 30.713l7.982 6.826 4.563-9.101c4.561-9.1 9.121-17.062 13.682-25.024 2.281-3.414 4.563-5.689 6.843-9.101l4.561-5.688-5.702-4.55c-23.947-19.338-52.454-32.989-83.243-38.676-29.647-5.688-59.296-4.55-86.663 4.551C82.103 131.441 161.924 67.739 256.57 67.739c53.595 0 103.769 20.475 141.399 58.014 27.368 26.163 45.613 59.151 53.595 95.553-17.105-5.689-35.35-7.964-53.595-7.964h-3.421c-6.841 0-13.684 1.138-21.666 1.138h-1.14c-2.28 0-5.702 1.137-7.982 1.137-4.562 1.138-7.984 1.138-12.544 2.275l-3.42 1.139c-3.422 1.136-6.843 2.275-10.264 3.411h-1.14c-7.982 2.275-14.825 5.689-22.805 9.101-3.422 1.138-6.843 3.413-10.264 5.688h-1.14c-17.105 10.238-33.07 22.75-45.613 38.675l-1.141 2.276c-3.419 4.55-5.701 7.962-7.982 10.237-2.28 2.275-3.421 5.688-5.701 9.1l-1.14 2.275c-2.28 3.414-3.421 6.826-4.561 9.101v1.138c-3.421 6.824-6.842 14.787-9.123 22.749v1.139c-5.702 18.201-9.123 37.538-9.123 58.012v21.615c0 2.275 1.141 5.687 1.141 7.962 5.702 27.301 18.245 53.462 37.63 77.353l1.14 1.137 1.141-1.137c7.982-9.099 26.227-37.54 28.507-54.602-9.121-17.063-13.684-36.402-13.684-54.601 0-63.703 50.175-117.165 115.172-120.579h4.561c26.228-1.137 52.455 6.825 74.121 21.613h1.14L512 265.669v-1.138c0-67.113-26.225-130.816-75.261-178.591C388.846 38.163 324.989 12 256.57 12z" fill="#F01F7A"/>
		</svg>
	);
}

function DockerIcon() {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
			<path d="M13.983 11.078h2.119a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.119a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 00.186-.186V3.574a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m0 2.716h2.118a.187.187 0 00.186-.186V6.29a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.887c0 .102.082.185.185.186m-2.93 0h2.12a.186.186 0 00.184-.186V6.29a.185.185 0 00-.185-.185H8.1a.185.185 0 00-.185.185v1.887c0 .102.083.185.185.186m-2.964 0h2.119a.186.186 0 00.185-.186V6.29a.185.185 0 00-.185-.185H5.136a.186.186 0 00-.186.185v1.887c0 .102.084.185.186.186m5.893 2.715h2.118a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m-2.93 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.185v1.888c0 .102.083.185.185.185m-2.964 0h2.119a.185.185 0 00.185-.185V9.006a.185.185 0 00-.184-.186h-2.12a.186.186 0 00-.186.186v1.887c0 .102.084.185.186.185m-2.92 0h2.12a.186.186 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.186v1.887c0 .102.082.185.185.185M23.763 9.89c-.065-.051-.672-.51-1.954-.51-.338.001-.676.03-1.01.087-.248-1.7-1.653-2.53-1.716-2.566l-.344-.199-.226.327c-.284.438-.49.922-.612 1.43-.23.97-.09 1.882.403 2.661-.595.332-1.55.413-1.744.42H.751a.751.751 0 00-.75.748 11.376 11.376 0 00.692 4.062c.545 1.428 1.355 2.48 2.41 3.124 1.18.723 3.1 1.137 5.275 1.137.983.003 1.963-.086 2.93-.266a12.248 12.248 0 003.823-1.389c.98-.567 1.86-1.288 2.61-2.136 1.252-1.418 1.998-2.997 2.553-4.4h.221c1.372 0 2.215-.549 2.68-1.009.309-.293.55-.65.707-1.046l.098-.288z" />
		</svg>
	);
}

const LINK_CONFIG = {
	pypi: { label: "View on PyPI", icon: <PyPIIcon />, color: "text-[#3775A9] dark:text-[#4B8BBE]" },
	ghcr: { label: "View on GHCR", icon: <Container size={16} className="shrink-0" />, color: "text-[#8250DF]" },
	dockerhub: { label: "View on Docker Hub", icon: <DockerIcon />, color: "text-[#2496ED]" },
} as const;

const BTN = "flex items-center gap-2 px-3 py-1.5 text-sm rounded-md w-full bg-gray-200 dark:bg-gray-700/50 text-gray-900 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition";

export default function SoftwareClient() {
	const [repos, setRepos] = useState<Repo[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function fetchRepos() {
			setLoading(true);
			try {
				const res = await fetch("/api/repos");
				if (!res.ok) throw new Error("Failed to fetch repos");
				const data: Repo[] = await res.json();
				setRepos(data);
			} catch (err) {
				console.error(err);
				setRepos([]);
			} finally {
				setLoading(false);
			}
		}
		fetchRepos();
	}, []);

	if (loading) {
		return <p className="text-center text-gray-400 text-sm">Loading repositories...</p>;
	}

	if (!repos.length) {
		return <p className="text-center text-gray-400 text-sm">No repositories found.</p>;
	}

	return (
		<div className="flex flex-col divide-y divide-gray-200 dark:divide-gray-800 border-y border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-900/40">
			{repos.map((repo) => (
				<div
					key={repo.id}
					className="flex flex-col md:flex-row transition-colors duration-200 hover:bg-white/60 dark:hover:bg-gray-800/30">

					{/* Content */}
					<div className="flex-1 flex flex-col justify-between px-5 pt-5 pb-5">
						{/* Header */}
						<div className="flex items-center gap-3 mb-3">
							<div className="rounded-md border bg-gray-100 dark:bg-gray-800/30 border-gray-300 dark:border-gray-700/70 flex items-center justify-center">
								<img src={repo.owner.avatar_url} alt={repo.name} className="w-8 h-8 rounded-sm object-cover" />
							</div>
							<h3 className="text-black dark:text-white font-semibold text-base">
								<a href={repo.html_url} target="_blank" className="hover:underline hover:underline-offset-2 flex items-center gap-1">
									{repo.name}
									<ExternalLink class="h-3.5 w-3.5 opacity-60 ml-1" />
								</a>
							</h3>
							{repo.archived && (
								<span className="px-2 py-0.5 text-xs rounded-full border border-yellow-400 dark:border-yellow-600 text-yellow-700 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 shrink-0">
									Archived
								</span>
							)}
						</div>

						{/* Description */}
						{repo.description && (
							<p className="text-gray-800 dark:text-gray-300 text-sm leading-snug mb-3 break-words">
								{repo.description}
							</p>
						)}

						{/* Topics */}
						{repo.topics?.length > 0 && (
							<div className="flex flex-wrap gap-2 mb-3">
								{repo.topics.map((t) => (
									<span key={t} className="px-2 py-0.5 text-xs rounded bg-blue-100 dark:bg-blue-500/15 text-blue-700 dark:text-blue-300">
										{t}
									</span>
								))}
							</div>
						)}

						{/* Meta */}
						<div className="flex flex-wrap items-center text-gray-700 dark:text-gray-400 text-sm gap-1">
							{[
								<span key="lang" className="flex items-center gap-1">
									<Code size={16} className="text-green-600 dark:text-green-400" />
									{repo.language ?? "Other"}
								</span>,
								repo.license && (
									<span key="license" className="flex items-center gap-1">
										<Scale size={16} className="text-purple-600 dark:text-purple-400" />
										{repo.license.name}
									</span>
								),
								<span key="stars" className="flex items-center gap-1">
									<Star size={16} className="text-yellow-600 dark:text-yellow-400" />
									{repo.stargazers_count}
								</span>,
								<span key="forks" className="flex items-center gap-1">
									<GitFork size={16} className="text-accent-600 dark:text-accent-400" />
									{repo.forks_count}
								</span>,
								<span key="issues" className="flex items-center gap-1">
									<AlertCircle size={16} className="text-red-600 dark:text-red-400" />
									{Math.max(0, repo.open_issues_count - (repo.open_prs ?? 0))}
								</span>,
								repo.open_prs !== undefined && (
									<span key="prs" className="flex items-center gap-1">
										<GitPullRequestArrow size={16} className="text-blue-600 dark:text-blue-400" />
										{repo.open_prs}
									</span>
								),
								repo.coverage !== null && repo.coverage !== undefined && (
									<span key="coverage" className="flex items-center gap-1">
										<CodecovIcon />
										<a
											href={`https://codecov.io/github/wattnet/${repo.name}`}
											target="_blank"
											className="hover:underline hover:underline-offset-2"
										>
											{repo.coverage}%
										</a>
									</span>
								),
								...(repo.workflows ?? []).map((wf) => (
									<span key={`wf-${wf.name}`} className="flex items-center gap-1">
										<WorkflowBadge name={wf.name} status={wf.status} url={wf.url} />
									</span>
								)),
								<span key="updated" className="flex items-center gap-1">
									<Calendar size={16} className="text-primary-600 dark:text-primary-400" />
									{formatUpdatedDate(repo.pushed_at)}
								</span>,
								repo.latest_release && (
									<span key="release" className="flex items-center gap-1">
										<Tag size={16} className="text-emerald-600 dark:text-emerald-400" />
										<a href={repo.latest_release.url} target="_blank" className="hover:underline hover:underline-offset-2">
											{repo.latest_release.tag}
										</a>
									</span>
								),
								repo.downloads !== null && repo.downloads !== undefined && (
									<span key="downloads" className="flex items-center gap-1">
										<Download size={16} className="text-sky-600 dark:text-sky-400" />
										{formatDownloads(repo.downloads)}
									</span>
								),
							]
								.filter(Boolean)
								.map((item, index, arr) => (
									<span key={index} className="flex items-center gap-1">
										{item}
										{index < arr.length - 1 && <span className="mx-1">·</span>}
									</span>
								))}
						</div>
					</div>

					{/* Sidebar links */}
					<div className="w-full md:w-52 flex flex-col gap-2 border-t md:border-t-0 md:border-l border-gray-300 dark:border-gray-700/70 bg-gray-100/60 dark:bg-gray-800/20 p-4 md:p-3">
						<a href={repo.html_url} target="_blank" className={BTN}>
							<GitHubIcon />
							View on GitHub
						</a>
						{repo.links && (Object.keys(repo.links) as Array<keyof typeof LINK_CONFIG>).map((key) => {
							const url = repo.links![key];
							if (!url) return null;
							const cfg = LINK_CONFIG[key];
							return (
								<a key={key} href={url} target="_blank" className={BTN}>
									<span className={cfg.color ?? ""}>{cfg.icon}</span>
									<span className={cfg.color ?? ""}>{cfg.label}</span>
								</a>
							);
						})}
					</div>
				</div>
			))}
		</div>
	);
}
