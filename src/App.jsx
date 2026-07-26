import { useCallback, useEffect, useState } from "react";
import { Article, MarkdownPage, NotFound, WritingIndex } from "./content/ContentViews.jsx";
import { workProof } from "./content/work.js";
import { ProofVisual } from "./components/ProofVisuals.jsx";
import { hrefForSection, hrefForView, viewFromSearch } from "./lib/routes.js";
import messageCore from "./assets/message-core.webp";

const defaultSite = {
  name: "Shubham Kumar",
  email: "bshubh@proton.me",
  github: "https://github.com/beshubh",
  admin: "https://shubh-portfolio-admin.shubhamkumar7051.workers.dev/admin/",
};

function plainClick(event) {
  return event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
}

function HeaderLink({ children, href, onClick }) {
  return (
    <a
      href={href}
      onClick={(event) => {
        if (!plainClick(event)) return;
        event.preventDefault();
        onClick();
      }}
    >
      {children}
    </a>
  );
}

function SiteHeader({ onNavigate, site, theme, toggleTheme }) {
  return (
    <>
      <div className="site-announcement">
        <span>~ PRINCIPAL SOFTWARE ENGINEER / BENGALURU, INDIA</span>
        <span>SYSTEMS THAT STAY USEFUL UNDER PRESSURE &gt;&gt;</span>
      </div>
      <header className="site-header">
        <HeaderLink href={hrefForView({ kind: "about" })} onClick={() => onNavigate({ kind: "about" })}>
          <span className="site-identity">
            <strong>SHUBHAM KUMAR</strong>
            <small>SYSTEMS / RELIABILITY<br />VOICE AI / RUST</small>
          </span>
        </HeaderLink>
        <nav aria-label="Primary navigation">
          <HeaderLink href={hrefForView({ kind: "about" })} onClick={() => onNavigate({ kind: "about" })}>
            [ ABOUT ]
          </HeaderLink>
          <HeaderLink href={hrefForSection("work")} onClick={() => onNavigate({ kind: "about" }, "work")}>
            [ PROOF ]
          </HeaderLink>
          <HeaderLink href={hrefForView({ kind: "writing" })} onClick={() => onNavigate({ kind: "writing" })}>
            [ WRITINGS ]
          </HeaderLink>
          <a href={site.github} rel="me">[ GITHUB ↗ ]</a>
          <button type="button" onClick={toggleTheme} aria-label="Toggle color theme">
            [ {theme === "dark" ? "LIGHT" : "DARK"} ]
          </button>
        </nav>
      </header>
    </>
  );
}

function Hero({ site }) {
  return (
    <section className="hero" id="about">
      <div className="hero-copy">
        <span className="route-label">~/ABOUT</span>
        <p className="system-line">~*~ SOFTWARE BUILT BY SHUBHAM KUMAR ~*~</p>
        <h1>I build software that stays useful when reality stops cooperating.</h1>
        <p className="hero-summary">
          Principal software engineer working on distributed systems, reliability,
          performance, and AI infrastructure. I like the part after the happy path.
        </p>
        <div className="hero-actions">
          <a href="#work">READ THE PROOF ↓</a>
          <a href={`mailto:${site.email}`}>SEND A MESSAGE ↗</a>
        </div>
      </div>

      <figure className="hero-artifact">
        <img src={messageCore} alt="Abstract interlocking metal sculpture representing a resilient message-processing core" />
        <figcaption className="artifact-note artifact-note--one">MESSAGE CORE<br />REV. 04</figcaption>
        <figcaption className="artifact-note artifact-note--two">FAILURE IS<br />ROUTABLE</figcaption>
        <span className="artifact-reading">100M+ / DAY</span>
      </figure>

      <div className="hero-status">
        <span>STATUS: BUILDING</span><span>LOCAL TIME: IST</span><span>SCROLL ↓</span>
      </div>
    </section>
  );
}

function AboutTimeline() {
  return (
    <section className="about-timeline" aria-labelledby="path-title">
      <div>
        <span className="route-label">~/PATH</span>
        <h2 id="path-title">Built from curiosity.<br />Sharpened in production.</h2>
      </div>
      <ol>
        <li><span>2017</span><strong>Started programming on an Android phone.</strong><p>The first program came before the first laptop.</p></li>
        <li><span>2020</span><strong>Shipped the first production backend.</strong><p>Search, pub/sub, real-time chat, and infrastructure for real users.</p></li>
        <li><span>2021 → NOW</span><strong>Growing systems at LimeChat.</strong><p>From backend engineer to principal engineer across messaging, voice, and reliability.</p></li>
      </ol>
    </section>
  );
}

function ProofStory({ proof, onNavigate }) {
  return (
    <article className={`proof-story proof-story--${proof.id}`}>
      <div className="proof-copy">
        <span className="proof-number"># {proof.index} / 03</span>
        <small>{proof.eyebrow}</small>
        <h3>{proof.title}</h3>
        <p>{proof.summary}</p>
        <ul>
          {proof.details.map((detail) => <li key={detail}>* {detail}</li>)}
        </ul>
        <dl>
          {proof.metrics.map((metric) => (
            <div key={metric.label}>
              <dt>{metric.label}</dt><dd>{metric.value}</dd>
            </div>
          ))}
        </dl>
        {proof.articleSlug ? (
          <a
            className="proof-essay"
            href={hrefForView({ kind: "post", slug: proof.articleSlug })}
            onClick={(event) => {
              if (!plainClick(event)) return;
              event.preventDefault();
              onNavigate({ kind: "post", slug: proof.articleSlug });
            }}
          >
            READ THE ENGINEERING NOTE ↗
          </a>
        ) : (
          <span className="proof-essay proof-essay--muted">INTERNAL SYSTEM / NO PUBLIC NOTE</span>
        )}
      </div>
      <div className="proof-visual">
        <header><span>FIG. {proof.index}</span><span>ANIMATED SYSTEM VIEW</span></header>
        <ProofVisual type={proof.id} />
        <footer>MODEL / SIMPLIFIED FOR EXPLANATION / NOT TO SCALE</footer>
      </div>
    </article>
  );
}

function ProofSection({ onNavigate }) {
  return (
    <section className="proof" id="work">
      <header className="section-heading">
        <span className="route-label">~/PROOF-OF-WORK</span>
        <div>
          <h2>Three systems that changed the company.</h2>
          <p>VOICE / MESSAGING / RELIABILITY</p>
        </div>
      </header>
      {workProof.map((proof) => <ProofStory key={proof.id} proof={proof} onNavigate={onNavigate} />)}
    </section>
  );
}

function Principle() {
  return (
    <section className="principle">
      <span>OPERATING PRINCIPLE / 001</span>
      <blockquote>
        “The goal is not zero failure.<br />
        It’s a system that <em>knows what to do next.</em>”
      </blockquote>
    </section>
  );
}

function Home({ onNavigate, site }) {
  return (
    <main id="main-content">
      <Hero site={site} />
      <AboutTimeline />
      <Principle />
      <ProofSection onNavigate={onNavigate} />
    </main>
  );
}

function ArchivePage({ page, title, description, onNavigate }) {
  return (
    <main id="main-content" className="reading-page archive-page">
      <header className="document-heading archive-heading">
        <p className="document-kicker">~/archive/{page}</p>
        <h1>{title}</h1>
        <p>{description}</p>
      </header>
      <MarkdownPage page={page} metadataKey={page} onNavigate={onNavigate} />
    </main>
  );
}

function SiteFooter({ onNavigate, site }) {
  return (
    <footer className="site-footer">
      <div>
        <span>~/CONTACT</span>
        <h2>Have a difficult system?</h2>
        <a href={`mailto:${site.email}`}>{site.email} ↗</a>
      </div>
      <p>SHUBHAM KUMAR<br />BENGALURU / INDIA<br />© {new Date().getFullYear()}</p>
      <nav>
        <a href={site.github} rel="me">GITHUB ↗</a>
        <HeaderLink href={hrefForView({ kind: "writing" })} onClick={() => onNavigate({ kind: "writing" })}>WRITINGS ↗</HeaderLink>
        <HeaderLink href={hrefForView({ kind: "history" })} onClick={() => onNavigate({ kind: "history" })}>CAREER LOG ↗</HeaderLink>
        <HeaderLink href={hrefForView({ kind: "projects" })} onClick={() => onNavigate({ kind: "projects" })}>PROJECTS ↗</HeaderLink>
        <a href={site.admin}>PUBLISH ↗</a>
        <a href="#top">BACK TO TOP ↑</a>
      </nav>
    </footer>
  );
}

export default function App() {
  const [view, setView] = useState(() => viewFromSearch(globalThis.location.search));
  const [site, setSite] = useState(defaultSite);
  const [theme, setTheme] = useState(() => globalThis.localStorage?.getItem("shubh-theme") || "dark");
  const [articleTitle, setArticleTitle] = useState("");

  const navigate = useCallback((nextView, section = "") => {
    const href = section ? `${hrefForView(nextView)}#${encodeURIComponent(section)}` : hrefForView(nextView);
    globalThis.history.pushState({}, "", href);
    setView(nextView);

    globalThis.requestAnimationFrame(() => {
      if (section) document.getElementById(section)?.scrollIntoView();
      else globalThis.scrollTo({ top: 0, behavior: "instant" });
    });
  }, []);

  useEffect(() => {
    function handlePopState() {
      setView(viewFromSearch(globalThis.location.search));
      globalThis.requestAnimationFrame(() => {
        if (globalThis.location.hash) document.querySelector(globalThis.location.hash)?.scrollIntoView();
        else globalThis.scrollTo({ top: 0, behavior: "instant" });
      });
    }
    globalThis.addEventListener("popstate", handlePopState);
    return () => globalThis.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetch("./content/site.json", { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : defaultSite))
      .then(setSite)
      .catch((error) => {
        if (error.name !== "AbortError") setSite(defaultSite);
      });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    globalThis.localStorage?.setItem("shubh-theme", theme);
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  useEffect(() => {
    const page = view.kind === "writing"
      ? "Writing"
      : view.kind === "post"
        ? articleTitle || "Essay"
        : view.kind === "history"
          ? "Career log"
          : view.kind === "projects"
            ? "Projects"
        : view.kind === "about"
          ? "Systems, reliability, voice AI"
          : "Not found";
    document.title = `${page} — ${site.name}`;
  }, [articleTitle, site.name, view.kind]);

  let content;
  if (view.kind === "about") content = <Home onNavigate={navigate} site={site} />;
  else if (view.kind === "writing") content = <main id="main-content" className="reading-page"><WritingIndex onNavigate={navigate} /></main>;
  else if (view.kind === "post") {
    content = (
      <main id="main-content" className="reading-page reading-page--article">
        <Article
          slug={view.slug}
          metadataKey={view.slug}
          onNavigate={navigate}
          onMetadata={(_, metadata) => setArticleTitle(metadata.title)}
        />
      </main>
    );
  } else if (view.kind === "history") {
    content = (
      <ArchivePage
        page="about"
        title="Career log"
        description="The longer path—from an Android phone to production systems at scale."
        onNavigate={navigate}
      />
    );
  } else if (view.kind === "projects") {
    content = (
      <ArchivePage
        page="projects"
        title="Systems lab"
        description="Small machines built to understand the large ones."
        onNavigate={navigate}
      />
    );
  } else content = <main id="main-content" className="reading-page"><NotFound /></main>;

  return (
    <div className="site-shell" data-theme={theme} id="top">
      <div className="page-frame" aria-hidden="true" />
      <a className="skip-link" href="#main-content">Skip to content</a>
      <SiteHeader
        onNavigate={navigate}
        site={site}
        theme={theme}
        toggleTheme={() => setTheme((current) => (current === "dark" ? "light" : "dark"))}
      />
      {content}
      <SiteFooter onNavigate={navigate} site={site} />
    </div>
  );
}
