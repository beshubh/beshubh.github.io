import { useCallback, useEffect, useState } from "react";
import {
  Article,
  ManSection,
  MarkdownPage,
  NotFound,
  RouteLink,
  WritingIndex,
  formatDate,
  useProjects,
  useWritingIndex,
} from "./content/ContentViews.jsx";
import { experience, options } from "./content/manual.js";
import { hrefForView, viewFromSearch } from "./lib/routes.js";

const defaultSite = {
  name: "Shubham Kumar",
  email: "bshubh@proton.me",
  github: "https://github.com/beshubh",
  linkedin: "https://www.linkedin.com/in/shubham--sk/",
};

const pageNames = { home: "Section 1", writing: "Writing", post: "Writing", about: "Story", "not-found": "Not found" };

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
      <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" />
    </svg>
  );
}

function SiteHeader({ view, onNavigate, site, theme, toggleTheme }) {
  const active = view.kind === "post" ? "writing" : view.kind;
  return (
    <header className="site-header">
      <RouteLink className="site-header__home" view={{ kind: "home" }} onNavigate={onNavigate} aria-label="Shubham Kumar — home">
        <span className="accent" aria-hidden="true">$</span> man shubham
      </RouteLink>
      <nav className="site-nav" aria-label="Primary navigation">
        <RouteLink view={{ kind: "writing" }} onNavigate={onNavigate} aria-current={active === "writing" ? "page" : undefined}>writing</RouteLink>
        <RouteLink view={{ kind: "about" }} onNavigate={onNavigate} aria-current={active === "about" ? "page" : undefined}>story</RouteLink>
        <a href={site.github} rel="me">github</a>
        {site.x ? <a href={site.x} rel="me">x</a> : null}
        <a href={`mailto:${site.email}`}>mail</a>
        <button
          type="button"
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
          title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
        >
          {theme === "dark" ? <SunIcon /> : <MoonIcon />}
        </button>
      </nav>
    </header>
  );
}

function Experience() {
  return (
    <ol className="jobs">
      {experience.map((job) => (
        <li key={job.company}>
          <div className="row">
            <span><strong>{job.company}</strong>{job.note ? ` ${job.note}` : ""} — {job.role}</span>
            <span className="meta">{job.dates}</span>
          </div>
          {job.highlights ? (
            <ul className="jobs__highlights">
              {job.highlights.map((highlight) => (
                <li key={highlight.result}>
                  <span className="jobs__result">{highlight.result}</span>
                  <span>{highlight.text}</span>
                </li>
              ))}
            </ul>
          ) : null}
          {job.path ? <p className="jobs__path meta">{job.path}</p> : null}
        </li>
      ))}
    </ol>
  );
}

function Projects() {
  const { status, projects } = useProjects();
  if (status !== "ready" || !projects.length) return null;
  return (
    <ManSection label="Projects">
      <ul className="projects">
        {projects.map((project) => (
          <li key={project.href}>
            <a className="mono-link" href={project.href}>{project.name}</a>
            <p className="indent">
              {project.description}{project.language ? <> <span className="meta">{project.language}</span></> : null}
            </p>
          </li>
        ))}
      </ul>
    </ManSection>
  );
}

const featuredWriting = ["improving-resilience-at-limechat", "story-of-how-we-built-voice-agents-at-limechat"];

function FeaturedWriting({ onNavigate }) {
  const state = useWritingIndex();
  if (state.status !== "ready") return null;
  const posts = featuredWriting.map((slug) => state.value.find((post) => post.slug === slug)).filter(Boolean);
  if (!posts.length) return null;
  return (
    <ManSection label="Writing">
      <ul className="featured-writing">
        {posts.map((post) => (
          <li key={post.slug} className="row">
            <RouteLink view={{ kind: "post", slug: post.slug }} onNavigate={onNavigate}>{post.title}</RouteLink>
            <time className="meta" dateTime={post.date}>{formatDate(post.date)}</time>
          </li>
        ))}
      </ul>
      <p className="all-writing">
        <RouteLink className="meta-link" view={{ kind: "writing" }} onNavigate={onNavigate}>all writing →</RouteLink>
      </p>
    </ManSection>
  );
}

function Home({ onNavigate, site }) {
  const seeAlso = [
    ["github(1)", site.github],
    ["x(1)", site.x],
    ["linkedin(1)", site.linkedin],
    ["resume(5)", site.resume],
  ].filter(([, href]) => href);

  return (
    <>
      <section className="man-section man-section--name">
        <p className="man-label">Name</p>
        <h1 className="man-body hero"><strong>shubham</strong> — backend and database engineer</h1>
      </section>
      <ManSection label="Options">
        <p className="options">{options.map((option) => <span key={option}>--{option}</span>)}</p>
      </ManSection>
      <ManSection label="Description">
        <p className="description">
          Backend engineer. Five years at LimeChat, SDE to principal. The systems and products I worked on there account
          for more than 60% of the company’s ARR.
        </p>
        <p className="description">
          Since leaving in August 2026 I have been going deep on systems engineering and databases. I finished the
          mini-lsm course and CMU 15-445, all labs at 100/100. Now I’m building{" "}
          <a className="accent-link" href="https://github.com/beshubh/hamilton_db">hamilton_db</a>, a relational OLTP
          database in Rust.
        </p>
        <p className="description description--aside">Lives in Bengaluru. Open to new roles.</p>
      </ManSection>
      <ManSection label="Experience"><Experience /></ManSection>
      <Projects />
      <FeaturedWriting onNavigate={onNavigate} />
      <ManSection label="Exit status">
        <p className="exit-status">
          <code>0</code>
          <span>Available. Write to <a className="accent-link" href={`mailto:${site.email}`}>{site.email}</a></span>
        </p>
      </ManSection>
      <ManSection label="See also">
        <p className="see-also">
          {seeAlso.map(([label, href]) => <a key={label} className="mono-link" href={href} rel="me">{label}</a>)}
        </p>
      </ManSection>
      <ManSection label="Bugs">
        <p>Will explain write-ahead logging for longer than you asked.</p>
      </ManSection>
    </>
  );
}

function Story({ onNavigate }) {
  return (
    <ManSection label="Story" heading="h1">
      <MarkdownPage page="about" onNavigate={onNavigate} />
    </ManSection>
  );
}

function SiteFooter() {
  const revised = new Intl.DateTimeFormat("en", { month: "long", year: "numeric" }).format(new Date());
  return (
    <footer className="site-footer">
      <span>Bengaluru</span>
      <span className="site-footer__date">{revised}</span>
      <span>open to roles</span>
    </footer>
  );
}

function titleFor(view, articleTitle) {
  if (view.kind === "home") return "Software engineer";
  if (view.kind === "post") return articleTitle || "Writing";
  return pageNames[view.kind];
}

export default function App() {
  const [view, setView] = useState(() => viewFromSearch(globalThis.location.search));
  const [site, setSite] = useState(defaultSite);
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || "light");
  const [articleTitle, setArticleTitle] = useState("");

  const navigate = useCallback((nextView) => {
    globalThis.history.pushState({}, "", hrefForView(nextView));
    setView(nextView);
    globalThis.requestAnimationFrame(() => globalThis.scrollTo({ top: 0, behavior: "instant" }));
  }, []);

  useEffect(() => {
    function handlePopState() {
      setView(viewFromSearch(globalThis.location.search));
      globalThis.requestAnimationFrame(() => globalThis.scrollTo({ top: 0, behavior: "instant" }));
    }
    globalThis.addEventListener("popstate", handlePopState);
    return () => globalThis.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetch("./content/site.json", { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : defaultSite))
      .then((loaded) => setSite({ ...defaultSite, ...loaded }))
      .catch(() => {});
    return () => controller.abort();
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    try {
      globalThis.localStorage.setItem("shubh-theme", next);
    } catch {
      // Storage can be unavailable (private windows); the theme still applies for this visit.
    }
  }

  useEffect(() => {
    document.title = `${titleFor(view, articleTitle)} — ${site.name}`;
  }, [articleTitle, site.name, view]);

  const onArticleMetadata = useCallback((metadata) => setArticleTitle(metadata.title), []);

  let content;
  if (view.kind === "home") content = <Home onNavigate={navigate} site={site} />;
  else if (view.kind === "writing") content = <WritingIndex onNavigate={navigate} />;
  else if (view.kind === "post") content = <Article slug={view.slug} onNavigate={navigate} onMetadata={onArticleMetadata} site={site} />;
  else if (view.kind === "about") content = <Story onNavigate={navigate} />;
  else content = <NotFound onNavigate={navigate} />;

  return (
    <div className="site">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <SiteHeader view={view} onNavigate={navigate} site={site} theme={theme} toggleTheme={toggleTheme} />
      <div className="manual-head">
        <span>Engineer’s manual</span>
        <span className="manual-head__page">{pageNames[view.kind]}</span>
      </div>
      <main id="main-content" key={view.kind === "post" ? view.slug : view.kind}>
        {content}
      </main>
      <SiteFooter />
    </div>
  );
}
