const pageViews = new Set(["home", "about", "writing"]);

// Older links keep working: the career log moved to the about page, and projects to the home page.
const pageAliases = { history: "about", projects: "home" };

export function viewFromSearch(search = "") {
  const params = new URLSearchParams(search);
  const post = params.get("post");

  if (post) return { kind: "post", slug: post };

  const requested = params.get("page") || "home";
  const page = pageAliases[requested] || requested;
  if (pageViews.has(page)) return { kind: page };

  return { kind: "not-found" };
}

export function hrefForView(view) {
  if (view.kind === "post") {
    return `./?post=${encodeURIComponent(view.slug)}`;
  }

  if (view.kind === "home") return "./";
  if (pageViews.has(view.kind)) return `./?page=${view.kind}`;
  return "./?page=not-found";
}

export function hrefForSection(section) {
  return `${hrefForView({ kind: "home" })}#${encodeURIComponent(section)}`;
}

export function idForView(view) {
  return view.kind === "post" ? `post:${view.slug}` : view.kind;
}
