import assert from "node:assert/strict";
import { hrefForSection, hrefForView, viewFromSearch } from "../src/lib/routes.js";

assert.deepEqual(viewFromSearch(""), { kind: "about" });
assert.deepEqual(viewFromSearch("?page=about"), { kind: "about" });
assert.deepEqual(viewFromSearch("?page=writing"), { kind: "writing" });
assert.deepEqual(viewFromSearch("?page=projects"), { kind: "projects" });
assert.deepEqual(viewFromSearch("?page=history"), { kind: "history" });
assert.deepEqual(viewFromSearch("?page=terminal"), {
  kind: "not-found",
});
assert.deepEqual(viewFromSearch("?post=improving-resilience-at-limechat"), {
  kind: "post",
  slug: "improving-resilience-at-limechat",
});
assert.deepEqual(viewFromSearch("?page=unknown"), {
  kind: "not-found",
});

assert.equal(hrefForView({ kind: "about" }), "./?page=about");
assert.equal(hrefForView({ kind: "writing" }), "./?page=writing");
assert.equal(hrefForView({ kind: "projects" }), "./?page=projects");
assert.equal(hrefForView({ kind: "history" }), "./?page=history");
assert.equal(
  hrefForView({ kind: "post", slug: "celery & queues" }),
  "./?post=celery%20%26%20queues",
);

assert.equal(
  hrefForSection("work"),
  "./?page=about#work",
  "The persistent navigation should be able to link directly to the home page proof section.",
);
