import { useEffect, useMemo, useState } from "react";
import { parseDocument } from "../../assets/markdown.js";
import { parseProjects } from "../lib/projects.js";
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

function LoadingDocument() {
  return <p className="document-state" role="status">Loading…</p>;
}

// One row of the manual: a section name in the gutter, its content beside it.
export function ManSection({ label, heading: Heading = "h2", children }) {
  return (
    <section className="man-section">
      <Heading className="man-label">{label}</Heading>
      <div className="man-body">{children}</div>
    </section>
  );
}

export function NotFound({ onNavigate }) {
  return (
    <ManSection label="Not found" heading="h1">
      <p>No manual entry for this page.</p>
      <p><RouteLink className="meta-link" view={{ kind: "home" }} onNavigate={onNavigate}>back to the manual</RouteLink></p>
    </ManSection>
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

export function WritingIndex({ onNavigate }) {
  const state = useWritingIndex();

  if (state.status === "loading") return <LoadingDocument />;
  if (state.status === "error") return <NotFound onNavigate={onNavigate} />;

  return (
    <ManSection label="Writing" heading="h1">
      <ol className="post-list">
        {state.value.map((post) => (
          <li key={post.slug}>
            <div className="row">
              <RouteLink view={{ kind: "post", slug: post.slug }} onNavigate={onNavigate}>{post.title}</RouteLink>
              <time className="meta" dateTime={post.date}>{formatDate(post.date)}</time>
            </div>
            {post.summary ? <p className="indent">{post.summary}</p> : null}
          </li>
        ))}
      </ol>
    </ManSection>
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

  return (
    <article className="man-section">
      <div className="article__meta">
        <RouteLink className="meta-link" view={{ kind: "writing" }} onNavigate={onNavigate}>← all writing</RouteLink>
        <time className="meta" dateTime={metadata.date}>{formatDate(metadata.date)}</time>
        <span className="meta">{readingMinutes(state.value)} min read</span>
      </div>
      <div className="man-body">
        <h1 className="article__title">{metadata.title}</h1>
        <Markup html={html} className="prose" onNavigate={onNavigate} />
        <footer className="article__footer">
          <a className="meta-link" href={`mailto:${site.email}?subject=${encodeURIComponent(`Re: ${metadata.title}`)}`}>reply by email</a>
        </footer>
      </div>
    </article>
  );
}

export function useProjects() {
  const state = useRemote("./content/pages/projects.md", asText);
  const projects = useMemo(
    () => (state.status === "ready" ? parseProjects(state.value) : []),
    [state],
  );
  return { status: state.status, projects };
}
