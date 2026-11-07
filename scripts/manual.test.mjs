import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { experience } from "../src/content/manual.js";
import { parseProjects } from "../src/lib/projects.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

assert.equal(experience[0].company, "LimeChat");
assert.ok(experience[0].highlights.length > 0, "LimeChat lists its highlights.");
for (const job of experience) {
  for (const highlight of job.highlights ?? []) {
    assert.match(highlight.result, /\d/, `${job.company}: every highlight leads with a number.`);
    assert.ok(highlight.text.length > 0, `${job.company}: every highlight explains its number.`);
  }
}

assert.deepEqual(
  parseProjects("- [mini-lsm](https://example.com/lsm) — An LSM-tree key-value store. `rust`"),
  [{ name: "mini-lsm", href: "https://example.com/lsm", description: "An LSM-tree key-value store.", language: "rust" }],
);
assert.equal(parseProjects("- [a](https://example.com) — No language.")[0].language, "");

const projects = parseProjects(await readFile(path.join(root, "content", "pages", "projects.md"), "utf8"));
assert.ok(projects.length > 0, "projects.md must keep at least one parseable project.");
for (const project of projects) assert.ok(project.language, `${project.name} must name its language.`);
