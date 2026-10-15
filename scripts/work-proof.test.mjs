import assert from "node:assert/strict";
import { workProof } from "../src/content/work.js";

assert.deepEqual(
  workProof.map(({ id }) => id),
  ["voice", "ums", "reliability"],
  "The home page must present Voice, UMS, and Reliability as its three proof stories.",
);

assert.equal(workProof.length, 3, "The home page should keep the proof section focused on three achievements.");

for (const proof of workProof) {
  assert.ok(proof.title, `${proof.id} must have a title.`);
  assert.ok(proof.summary, `${proof.id} must explain the work.`);
  assert.ok([0, 2].includes(proof.metrics.length), `${proof.id} must expose two concrete proof points or none.`);
}

assert.equal(workProof[0].articleSlug, "story-of-how-we-built-voice-agents-at-limechat");
assert.equal(workProof[1].articleSlug, null, "UMS does not yet have a dedicated essay.");
assert.equal(workProof[2].articleSlug, "improving-resilience-at-limechat");
