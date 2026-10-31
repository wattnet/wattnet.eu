/** Latest run of a workflow as one status string (the conclusion once finished). */
export function runStatus(run) {
  return run.status === 'completed' ? run.conclusion : run.status;
}

/** Total downloads across registries, or null when there are none. */
export function sumDownloads(...counts) {
  return counts.reduce((sum, n) => sum + (n ?? 0), 0) || null;
}

/** True if a PyPI package points at a repo of this GitHub owner (same name alone proves nothing). */
export function pypiBelongsTo(owner, info) {
  const urls = [info?.home_page, ...Object.values(info?.project_urls ?? {})];
  return urls.some(
    (u) => typeof u === 'string' && u.toLowerCase().includes(`github.com/${owner}/`),
  );
}
