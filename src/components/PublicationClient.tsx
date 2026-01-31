import { useState, useRef, useEffect } from "preact/hooks";
import * as Icons from "lucide-preact";
import { ExternalLink, ChevronDown, ChevronUp } from "lucide-preact";
import orcidIcon from "../assets/logos/external/orcid.svg";

interface Link {
	title: string;
	url: string;
	color: string;
	icon: string;
}

interface Author {
	name: string;
	orcid: string;
}

interface Tag {
	title: string;
	icon: string; // nombre del icono (string)
	color: string;
}

interface Publication {
	title: string;
	description: string;
	year: number;
	type: string;
	publisher: string;
	doi: string;
	authors: Author[];
	links: Link[];
	tags?: Tag[];
}

interface Props {
	publications: Publication[];
}

export default function PublicationClient({ publications }: Props) {
	const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
	const [showToggle, setShowToggle] = useState<boolean[]>([]);

	const paragraphRefs = useRef<(HTMLParagraphElement | null)[]>([]);

	// Medimos líneas después de render
	useEffect(() => {
		const toggleArray = publications.map((_, idx) => {
			const el = paragraphRefs.current[idx];
			if (!el) return false;

			const lineHeight = parseFloat(getComputedStyle(el).lineHeight);
			const lines = el.scrollHeight / lineHeight;
			return lines > 4; // mostrar toggle solo si > 4 líneas
		});
		setShowToggle(toggleArray);
	}, [publications]);

	return (
		<div className="flex flex-col gap-4">
			{publications.map((pub, idx) => {
				const isExpanded = expandedIndex === idx;
				const IconChevron = isExpanded ? ChevronUp : ChevronDown;

				return (
					<div
						key={pub.title}
						className="flex flex-col md:flex-row bg-white dark:bg-gray-900/60 backdrop-blur-md border border-gray-300 dark:border-gray-700/70 rounded-xl transition-all duration-200
            			hover:shadow-lg hover:border-gray-400 dark:hover:border-gray-600">
						{/* Left */}
						<div className="flex-1 px-5 py-5">
							<h3 className="text-black dark:text-white font-semibold text-base mb-2">
								<a
									href={pub.links[0]?.url ?? "#"}
									target="_blank"
									rel="noopener noreferrer"
									className="hover:underline break-words">
									{pub.title}{" "}
									<ExternalLink
										className="w-3.5 h-3.5 inline-flex items-center opacity-60 ml-1"
										style={{ verticalAlign: "middle" }}
									/>
								</a>
							</h3>

							{/* Authors */}
							<div className="flex flex-wrap gap-2 mb-2 text-sm text-gray-700 dark:text-gray-300">
								{pub.authors.map((a, i) => (
									<div key={a.orcid} className="flex items-center gap-1.5">
										<a
											href={a.orcid}
											target="_blank"
											rel="noopener noreferrer"
											className="flex items-center gap-1.5 font-semibold hover:underline cursor-pointer">
											<span>{a.name}</span>
											<img
												src={orcidIcon.src}
												alt="ORCID"
												className="w-4.25 h-4.25"
											/>
										</a>
										{i < pub.authors.length - 1 && <span>·</span>}
									</div>
								))}
							</div>

							{/* Description */}
							<div>
								<p
									ref={(el) => {
										paragraphRefs.current[idx] = el;
									}}
									className={`text-gray-800 dark:text-gray-300 text-sm leading-snug mb-2 break-words text-justify ${
										!isExpanded ? "line-clamp-4" : ""
									}`}>
									{pub.description}
								</p>

								{/* Toggle */}
								{showToggle[idx] && (
									<div
										className="flex items-center gap-3 cursor-pointer select-none group"
										onClick={() => setExpandedIndex(isExpanded ? null : idx)}>
										<div className="flex-1 h-px bg-gray-300 dark:bg-gray-700" />
										<span className="flex items-center gap-1 text-xs">
											{isExpanded ? "Read less" : "Read more"}
											<IconChevron className="w-4 h-4" />
										</span>
										<div className="flex-1 h-px bg-gray-300 dark:bg-gray-700" />
									</div>
								)}
							</div>

							{/* Meta */}
							<div className="flex flex-wrap gap-2 mt-3 text-sm text-gray-600 dark:text-gray-400">
								<span>
									<strong>Date:</strong> {pub.year}
								</span>{" "}
								·
								<span>
									<strong>Type:</strong> {pub.type}
								</span>{" "}
								·
								<span>
									<strong>Publisher:</strong> {pub.publisher}
								</span>{" "}
								·
								<span>
									<strong>DOI:</strong>{" "}
									<a
										href={`https://doi.org/${pub.doi}`}
										target="_blank"
										className="text-blue-600 dark:text-blue-400">
										{pub.doi}
									</a>
								</span>
							</div>

							{/* Tags */}
							<div className="flex flex-wrap gap-2 mt-3">
								{pub.tags?.map((tag) => {
									const Icon = Icons[tag.icon as keyof typeof Icons] as any;
									return (
										<div
											key={tag.title}
											className={`flex items-center gap-2 px-2 py-1 rounded ${tag.color} text-sm transition hover:shadow-sm`}>
											{Icon && <Icon className="w-3.5 h-3.5" />}
											<span>{tag.title}</span>
										</div>
									);
								})}
							</div>
						</div>

						{/* Right */}
						<div
							className="w-full md:w-auto flex flex-col items-stretch gap-3 border-t md:border-t-0 md:border-l border-gray-300 dark:border-gray-700/70 
							bg-gray-100 dark:bg-gray-800/30 p-4 md:p-3
							md:rounded-tr-xl md:rounded-br-xl">
							{pub.links.map((link) => (
								<a
									key={link.url}
									href={link.url}
									target="_blank"
									className={`flex items-center gap-3 px-4 py-1.5 text-sm rounded-md bg-gray-200 dark:bg-gray-700/50 ${link.color} hover:bg-gray-300 dark:hover:bg-gray-600 transition w-full`}>
									<img src={link.icon} className="w-4 h-4" />
									<span>View on {link.title}</span>
								</a>
							))}
						</div>
					</div>
				);
			})}
		</div>
	);
}
