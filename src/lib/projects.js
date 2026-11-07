// projects.md is edited by hand, so read its list items rather than hard-coding them:
// - [name](url) — Description. `language`
export function parseProjects(markdown) {
  const items = [];
  for (const line of markdown.split("\n")) {
    const match = line.match(/^\s*[-*]\s+\[([^\]]+)]\(([^)]+)\)\s*[—–-]\s*(.+?)(?:\s+`([^`]+)`)?\s*$/);
    if (match) items.push({ name: match[1], href: match[2], description: match[3], language: match[4] || "" });
  }
  return items;
}
