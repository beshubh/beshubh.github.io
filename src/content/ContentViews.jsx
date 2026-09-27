import { useEffect, useMemo, useState } from "react";
import { parseDocument } from "../../assets/markdown.js";
import { hrefForView, viewFromSearch } from "../lib/routes.js";

export function plainClick(event) {
  return event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
}

export function RouteLink({ view, onNavigate, className, children, ...rest }) {
  return (
    <a
      {...rest}
      className={className}
      href={hrefForView(view)}
      onClick={(event) => {
        if (!plainClick(event)) return;
        event.preventDefault();
        onNavigate(view);
      }}
    >
      {children}
    </a>
  );
}

function useRemote(url, parse) {
  const [state, setState] = useState({ status: "loading", value: null });

  useEffect(() => {
    const controller = new AbortController();
    setState({ status: "loading", value: null });

    fetch(url, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`Could not load ${url}`);
        return parse(response);
      })
      .then((value) => setState({ status: "ready", value }))
      .catch((error) => {
        if (error.name !== "AbortError") setState({ status: "error", value: null });
      });

    return () => controller.abort();
  }, [url, parse]);

  return state;
}

const asText = (response) => response.text();
const asJson = (response) => response.json();

export function useWritingIndex() {
  return useRemote("./content/writings/index.json", asJson);
}

export function formatDate(date) {
  if (!date) return "";
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}

// Stable per-tag colors, in the spirit of a syntax theme.
const tagHues = ["blue", "orange", "yellow", "green", "violet", "red", "cyan"];
const knownTags = {
  rust: "orange",
  "distributed-systems": "blue",
  reliability: "green",
  search: "yellow",
  systems: "cyan",
  python: "violet",
  celery: "red",
  webrtc: "violet",
  "voice-ai": "yellow",
};

export function tagColor(tag) {
  if (knownTags[tag]) return knownTags[tag];
  let hash = 0;
  for (const char of tag) hash = (hash * 31 + char.charCodeAt(0)) | 0;
  return tagHues[Math.abs(hash) % tagHues.length];
}

export function Tags({ tags = [] }) {
  if (!tags.length) return null;
  return (
    <span className="tags">
      [{tags.map((tag, index) => (
        <span key={tag}>
          {index ? ", " : ""}
          <span className={`tag tag--${tagColor(tag)}`}>{tag}</span>
        </span>
      ))}]
    </span>
  );
}

export function Dots() {
  return <div className="dots" aria-hidden="true" />;
}

function LoadingDocument() {
  return (
    <div className="document-state" role="status">
      <span className="spinner" aria-hidden="true" /> loading…
    </div>
  );
}

export function NotFound({ onNavigate }) {
  return (
    <div className="not-found">
      <pre aria-hidden="true">{`
 _  _    ___   _  _
| || |  / _ \\ | || |
| || |_| | | || || |_
|__   _| |_| ||__   _|
   |_|  \\___/    |_|`}</pre>
      <p><span className="prompt">$</span> cat ./this-page</p>
      <p className="muted">cat: ./this-page: No such file or directory</p>
      <p>
        <RouteLink view={{ kind: "home" }} onNavigate={onNavigate}>cd ~</RouteLink>
      </p>
    </div>
  );
}

export function Markup({ html, className = "", onNavigate }) {
  function handleClick(event) {
    if (event.defaultPrevented || !plainClick(event)) return;
    const anchor = event.target.closest("a");
    if (!anchor) return;

    const url = new URL(anchor.href, globalThis.location.href);
    if (url.origin !== globalThis.location.origin || url.pathname !== globalThis.location.pathname) return;
    if (!url.searchParams.has("post") && !url.searchParams.has("page")) return;

    event.preventDefault();
    onNavigate(viewFromSearch(url.search));
  }

  return (
    <div
      className={className}
      onClick={handleClick}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export function MarkdownPage({ page, onNavigate, className = "" }) {
  const state = useRemote(`./content/pages/${page}.md`, asText);
  const parsed = useMemo(
    () => (state.status === "ready" ? parseDocument(state.value) : null),
    [state],
  );

  if (state.status === "loading") return <LoadingDocument />;
  if (state.status === "error") return <NotFound onNavigate={onNavigate} />;

  return <Markup html={parsed.html} className={`prose ${className}`} onNavigate={onNavigate} />;
}

export function PageHeading({ title, aside }) {
  return (
    <header className="page-heading">
      <h1>{title}</h1>
      {aside ? <div className="page-heading__aside">{aside}</div> : null}
    </header>
  );
}

export function PostList({ posts, onNavigate, site }) {
  return (
    <ol className="post-list">
      {posts.map((post) => (
        <li key={post.slug}>
          <Dots />
          <article className="post-row">
            <h2>
              <RouteLink view={{ kind: "post", slug: post.slug }} onNavigate={onNavigate}>{post.title}</RouteLink>
              {" "}<Tags tags={post.tags} />
            </h2>
            <p className="byline">
              {site.name} <span className="muted">[</span><a href={site.github}>@{site.handle}</a><span className="muted">]</span>
              <span className="muted"> | </span>
              <time className="muted" dateTime={post.date}>{formatDate(post.date)}</time>
            </p>
            {post.summary ? (
              <p className="post-row__summary">
                {post.summary}{" "}
                <RouteLink className="chip-arrow" view={{ kind: "post", slug: post.slug }} onNavigate={onNavigate} aria-label={`Read ${post.title}`}>→</RouteLink>
              </p>
            ) : null}
          </article>
        </li>
      ))}
      <li><Dots /></li>
    </ol>
  );
}

export function WritingIndex({ onNavigate, site }) {
  const state = useWritingIndex();
  const [filter, setFilter] = useState("all");

  if (state.status === "loading") return <LoadingDocument />;
  if (state.status === "error") return <NotFound onNavigate={onNavigate} />;

  const posts = state.value;
  const counts = new Map();
  for (const post of posts) for (const tag of post.tags || []) counts.set(tag, (counts.get(tag) || 0) + 1);
  const tags = [...counts.keys()].sort((a, b) => counts.get(b) - counts.get(a) || a.localeCompare(b));
  const visible = filter === "all" ? posts : posts.filter((post) => post.tags?.includes(filter));

  return (
    <>
      <PageHeading
        title="Writing"
        aside={<span className="muted">{posts.length} posts · <span className="accent">newest first</span></span>}
      />
      <nav className="filters" aria-label="Filter writing by topic">
        {["all", ...tags].map((tag, index) => (
          <span key={tag}>
            {index ? <span className="pipe" aria-hidden="true">|</span> : null}
            <button
              type="button"
              className={`filter ${tag === "all" ? "" : `tag--${tagColor(tag)}`}`}
              aria-pressed={filter === tag}
              onClick={() => setFilter(tag)}
            >
              {tag === "all" ? "All" : tag}
            </button>
          </span>
        ))}
      </nav>
      <PostList posts={visible} onNavigate={onNavigate} site={site} />
    </>
  );
}

function readingMinutes(markdown) {
  return Math.max(1, Math.round(markdown.split(/\s+/).length / 230));
}

export function Article({ slug, onNavigate, onMetadata, site }) {
  const state = useRemote(`./content/writings/${encodeURIComponent(slug)}.md`, asText);
  const parsed = useMemo(
    () => (state.status === "ready" ? parseDocument(state.value) : null),
    [state],
  );

  useEffect(() => {
    if (parsed) onMetadata?.(parsed.metadata);
  }, [onMetadata, parsed]);

  if (state.status === "loading") return <LoadingDocument />;
  if (state.status === "error") return <NotFound onNavigate={onNavigate} />;

  const { metadata, html } = parsed;
  const tags = Array.isArray(metadata.tags) ? metadata.tags : [];

  return (
    <article className="article">
      <RouteLink className="back-link" view={{ kind: "writing" }} onNavigate={onNavigate}>
        <span className="prompt">$</span> cd ../writing
      </RouteLink>
      <header className="article__header">
        <h1>{metadata.title}</h1>
        <p className="byline">
          {site.name} <span className="muted">[</span><a href={site.github}>@{site.handle}</a><span className="muted">]</span>
          <span className="muted"> | </span>
          <time className="muted" dateTime={metadata.date}>{formatDate(metadata.date)}</time>
          <span className="muted"> | {readingMinutes(state.value)} min read</span>
        </p>
        {tags.length ? <p><Tags tags={tags} /></p> : null}
      </header>
      <Dots />
      <Markup html={html} className="prose article__body" onNavigate={onNavigate} />
      <Dots />
      <footer className="article__footer">
        <RouteLink view={{ kind: "writing" }} onNavigate={onNavigate}>← all writing</RouteLink>
        <a href={`mailto:${site.email}?subject=${encodeURIComponent(`Re: ${metadata.title}`)}`}>reply by email →</a>
      </footer>
    </article>
  );
}

// projects.md is edited by hand and by the publisher, so read its list items rather than hard-coding them.
export function parseProjects(markdown) {
  const items = [];
  for (const line of markdown.split("\n")) {
    const match = line.match(/^\s*[-*]\s+\[([^\]]+)]\(([^)]+)\)\s*[—–-]\s*(.+)$/);
    if (match) items.push({ name: match[1], href: match[2], description: match[3].trim() });
  }
  return items;
}

export function useProjects() {
  const state = useRemote("./content/pages/projects.md", asText);
  const projects = useMemo(
    () => (state.status === "ready" ? parseProjects(state.value) : []),
    [state],
  );
  return { status: state.status, projects };
}

export function repoPath(href) {
  try {
    const url = new URL(href);
    return `${url.hostname.replace(/^www\./, "")}${url.pathname}`.replace(/\/$/, "");
  } catch {
    return href;
  }
}

export function ProjectList({ projects, numbered = true }) {
  return (
    <ol className="project-list">
      {projects.map((project, index) => (
        <li key={project.href}>
          <Dots />
          <article className="project-row">
            {numbered ? <span className="project-row__index">{String(index + 1).padStart(2, "0")}</span> : null}
            <div>
              <h2><a href={project.href}>{project.name}</a> <span className="muted">[</span><span className="tag tag--blue">{repoPath(project.href)}</span><span className="muted">]</span></h2>
              <p>{project.description} <a className="chip-arrow" href={project.href} aria-label={`Open ${project.name}`}>→</a></p>
            </div>
          </article>
        </li>
      ))}
      <li><Dots /></li>
    </ol>
  );
}

export function ProjectsPage({ onNavigate }) {
  const { status, projects } = useProjects();

  if (status === "loading") return <LoadingDocument />;
  if (status === "error") return <NotFound onNavigate={onNavigate} />;

  return (
    <>
      <PageHeading
        title="Projects"
        aside={<span className="muted">small machines built to understand the large ones</span>}
      />
      <p className="lede">
        Things I build on weekends to learn how the infrastructure I use at work actually works — search engines,
        log brokers, interpreters, consensus. Mostly Rust. Source for all of it is on GitHub.
      </p>
      {projects.length ? (
        <ProjectList projects={projects} />
      ) : (
        <MarkdownPage page="projects" onNavigate={onNavigate} />
      )}
    </>
  );
}
