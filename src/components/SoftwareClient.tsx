import { useEffect, useState } from "preact/hooks";
import {
	Star,
	GitFork,
	AlertCircle,
	GitPullRequestArrow,
	Code,
	Scale,
	Calendar,
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
}

function formatUpdatedDate(date: string): string {
	return `Updated on ${new Date(date).toLocaleDateString("en-US", {
		month: "short",
		day: "2-digit",
		year: "numeric",
	})}`;
}

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
		<div className="flex flex-col gap-5">
			{repos.map((repo) => (
				<div
					key={repo.id}
					className="
        flex flex-col md:flex-row
        bg-gray-900/60 backdrop-blur-md border border-gray-700/70
        rounded-xl overflow-hidden transition-all duration-200
        hover:shadow-2xl hover:border-gray-600
      ">
					{/* Desktop logo */}
					<div className="hidden md:flex w-36 flex-shrink-0 items-center justify-center border-r border-gray-700/70 bg-gray-800/30 p-4">
						<img
							src={repo.owner.avatar_url}
							alt={repo.name}
							className="w-28 h-28 rounded-md object-cover"
						/>
					</div>

					{/* Mobile header */}
					<div className="flex items-center gap-3 p-4 md:hidden">
						<img
							src={repo.owner.avatar_url}
							alt={repo.name}
							className="w-10 h-10 rounded-md object-cover"
						/>
						<h3 className="text-white font-semibold text-base">
							<a
								href={repo.html_url}
								target="_blank"
								className="hover:underline hover:underline-offset-2">
								{repo.name}
							</a>
						</h3>
					</div>

					{/* Center info */}
					<div className="flex-1 flex flex-col justify-between px-4 pt-0 pb-6 md:pt-4 md:pb-4">
						{/* Desktop title */}
						<h3 className="hidden md:block text-white font-semibold text-base mb-2">
							<a
								href={repo.html_url}
								target="_blank"
								className="hover:underline hover:underline-offset-2">
								{repo.name}
							</a>
						</h3>

						{/* Description */}
						{repo.description && (
							<p className="text-gray-300 text-sm leading-snug mb-3 break-words">
								{repo.description}
							</p>
						)}

						{/* Tags */}
						{repo.topics?.length > 0 && (
							<div className="flex flex-wrap gap-2 mb-3">
								{repo.topics.map((t) => (
									<span
										key={t}
										className="px-2 py-0.5 text-xs rounded bg-blue-500/15 text-blue-300">
										{t}
									</span>
								))}
							</div>
						)}

						{/* Meta */}
						<div className="flex flex-wrap items-center text-gray-400 text-sm gap-1">
							{[
								repo.language && (
									<span key="lang" className="flex items-center gap-1">
										<Code size={16} className="text-green-400" />
										{repo.language}
									</span>
								),
								repo.license && (
									<span key="license" className="flex items-center gap-1">
										<Scale size={16} className="text-purple-400" />
										{repo.license.name}
									</span>
								),
								<span key="stars" className="flex items-center gap-1">
									<Star size={16} className="text-yellow-400" />
									{repo.stargazers_count}
								</span>,
								<span key="forks" className="flex items-center gap-1">
									<GitFork size={16} className="text-accent-400" />
									{repo.forks_count}
								</span>,
								<span key="issues" className="flex items-center gap-1">
									<AlertCircle size={16} className="text-red-400" />
									{repo.open_issues_count}
								</span>,
								repo.open_prs !== undefined && (
									<span key="prs" className="flex items-center gap-1">
										<GitPullRequestArrow size={16} className="text-blue-400" />
										{repo.open_prs}
									</span>
								),
								<span key="updated" className="flex items-center gap-1">
									<Calendar size={16} className="text-primary-400" />
									{formatUpdatedDate(repo.pushed_at)}
								</span>,
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

					{/* Right section */}
					<div
						className="
							w-full md:w-48
							flex flex-col justify-start gap-3
							border-t md:border-t-0 md:border-l border-gray-700/70
							bg-gray-800/30
							p-4 md:p-3
						">
						<a
							href={repo.html_url}
							target="_blank"
							className="flex items-center justify-center gap-2 px-3 py-1.5 text-sm rounded-md bg-gray-700/50 text-gray-200 hover:bg-gray-600 transition">
							{/* GitHub Logo */}
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="w-4 h-4 mr-2"
								fill="currentColor"
								viewBox="0 0 24 24">
								<path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.11.82-.26.82-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.386-1.334-1.754-1.334-1.754-1.09-.745.082-.729.082-.729 1.205.084 1.84 1.24 1.84 1.24 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.304.76-1.604-2.665-.305-5.466-1.332-5.466-5.931 0-1.31.47-2.38 1.235-3.22-.124-.303-.535-1.524.117-3.176 0 0 1.007-.322 3.3 1.23a11.52 11.52 0 013-.404c1.02.005 2.045.137 3 .404 2.29-1.552 3.296-1.23 3.296-1.23.653 1.653.242 2.874.118 3.176.77.84 1.233 1.91 1.233 3.22 0 4.61-2.804 5.625-5.475 5.921.43.372.815 1.106.815 2.228v3.293c0 .32.218.694.825.576C20.565 21.796 24 17.3 24 12c0-6.63-5.373-12-12-12z" />
							</svg>
							View on GitHub
						</a>
					</div>
				</div>
			))}
		</div>
	);
}
