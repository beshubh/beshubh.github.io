import { useCallback, useEffect, useState } from "react";
import {
  Article,
  Dots,
  MarkdownPage,
  NotFound,
  PageHeading,
  PostList,
  ProjectList,
  ProjectsPage,
  RouteLink,
  WritingIndex,
  useProjects,
  useWritingIndex,
} from "./content/ContentViews.jsx";
import { workProof } from "./content/work.js";
import { Clock, CountUp, DecryptBanner, FlowDiagram, Torus, Typewriter } from "./components/Ascii.jsx";
import { hrefForView, viewFromSearch } from "./lib/routes.js";

const defaultSite = {
  name: "Shubham Kumar",
  email: "bshubh@proton.me",
  github: "https://github.com/beshubh",
  linkedin: "https://www.linkedin.com/in/shubham--sk/",
  admin: "https://shubh-portfolio-admin.shubhamkumar7051.workers.dev/admin/",
};

function withDerived(site) {
  const handle = site.handle || new URL(site.github).pathname.split("/").filter(Boolean)[0] || "";
  return { ...site, handle };
}

const primaryNav = [
  { kind: "home", label: "Home", key: "h" },
  { kind: "writing", label: "Writing", key: "w" },
  { kind: "projects", label: "Projects", key: "p" },
  { kind: "about", label: "About", key: "a" },
];

function contactLinks(site) {
  return [
    { label: "github", href: site.github, text: site.github.replace(/^https?:\/\//, "") },
    { label: "email", href: `mailto:${site.email}`, text: site.email },
    site.linkedin && { label: "linkedin", href: site.linkedin, text: site.linkedin.replace(/^https?:\/\/(www\.)?/, "") },
    site.x && { label: "x", href: site.x, text: site.x.replace(/^https?:\/\/(www\.)?/, "") },
  ].filter(Boolean);
}

function Announcement({ onNavigate }) {
  const state = useWritingIndex();
  const latest = state.status === "ready" ? state.value[0] : null;
  if (!latest) return <div className="announcement" aria-hidden="true">&nbsp;</div>;

  return (
    <div className="announcement">
      <span>New writing: {latest.title.replace(/\.$/, "")}.</span>{" "}
      <RouteLink className="announcement__cta" view={{ kind: "post", slug: latest.slug }} onNavigate={onNavigate}>Read it</RouteLink>
    </div>
  );
}

function SiteHeader({ view, onNavigate, site, theme, toggleTheme }) {
  const active = view.kind === "post" ? "writing" : view.kind;
  return (
    <header className="site-header">
      <RouteLink className="logo" view={{ kind: "home" }} onNavigate={onNavigate} aria-label="Shubham Kumar — home">
        <span className="logo__mark" aria-hidden="true">sk<span className="logo__cursor">_</span></span>
      </RouteLink>
      <nav className="site-nav" aria-label="Primary navigation">
        {primaryNav.map((item, index) => (
          <span key={item.kind}>
            {index ? <span className="pipe" aria-hidden="true">|</span> : null}
            <RouteLink
              view={{ kind: item.kind }}
              onNavigate={onNavigate}
              aria-current={active === item.kind ? "page" : undefined}
              aria-keyshortcuts={item.key}
            >
              {item.label}
            </RouteLink>
          </span>
        ))}
      </nav>
      <div className="site-header__actions">
        <button type="button" className="theme-toggle" onClick={toggleTheme} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}>
          {theme === "dark" ? "☼" : "☾"}
        </button>
        <a className="button button--outline" href={site.github} rel="me">GitHub</a>
        <a className="button button--solid" href={`mailto:${site.email}`}>Get in touch</a>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/* Home                                                                */
/* ------------------------------------------------------------------ */

const impactLog = [
  { tag: "messaging", what: <>designed the <em>Unified Messages System</em>, one backbone for every channel</>, result: "100M+ msgs · 1B+ req / day" },
  { tag: "agent-studio", what: <>shipped <em>Agent Studio</em>: scripted Rasa bots → LLM agents that reason and use tools</>, result: "Rasa → agents" },
  { tag: "agent-studio", what: <>added a <em>semantic cache</em> so familiar questions skip the full model round trip</>, result: "−30% latency" },
  { tag: "voice", what: <>started LimeChat’s <em>voice product</em>: AI agents that take WhatsApp calls</>, result: "$600K+ revenue" },
  { tag: "voice", what: <>rewrote the call media bridge from <em>Python to Rust</em></>, result: "−80% cpu" },
  { tag: "reliability", what: <>added <em>circuit breakers + fallback queues</em> across Kafka, RabbitMQ, Redis</>, result: "0 overload outages" },
];

function Hero({ site, onNavigate }) {
  const [copied, setCopied] = useState(false);
  const command = `echo "hi" | mail ${site.email}`;

  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__grid">
        <div className="hero__copy">
          <p className="comment">// principal software engineer · bengaluru, in</p>
          <DecryptBanner word="SHUBHAM" label="Shubham" />
          <h1 id="hero-title">
            I build systems that <span className="accent">stay up</span> when reality stops cooperating.
          </h1>
          <p className="hero__summary">
            Principal engineer at <a href="https://limechat.ai">LimeChat</a>. I designed the messaging backbone that moves
            100M+ messages a day, started the company's voice AI product, and led the work that taught our overloaded systems
            to protect themselves. I like the part after the happy path.
          </p>
          <div className="command">
            <span className="prompt">$</span>
            <code>{command}</code>
            <button
              type="button"
              onClick={() => {
                const clipboard = globalThis.navigator.clipboard;
                if (!clipboard) return;
                clipboard.writeText(site.email).then(() => {
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1600);
                }, () => {});
              }}
            >
              {copied ? "COPIED" : "COPY EMAIL"}
            </button>
          </div>
          <div className="hero__actions">
            <RouteLink className="button button--solid button--lg" view={{ kind: "writing" }} onNavigate={onNavigate}>Read the writing →</RouteLink>
            <a className="button button--outline button--lg" href="#work">See the work ↓</a>
          </div>
        </div>
        <figure className="hero__visual">
          <figcaption>
            <span>fig.0 — torus.rs</span>
            <span className="muted">rendering @ 30fps</span>
          </figcaption>
          <Torus />
          <div className="hero__status">
            <span><i className="led" aria-hidden="true" /> status: building</span>
            <Clock />
          </div>
        </figure>
      </div>
      <div className="impact-log">
        <p className="impact-log__cmd"><b>shubham@limechat</b>:~$ cat impact.log</p>
        <ol>
          {impactLog.map((entry) => (
            <li key={entry.result}>
              <span className="impact-log__tag">[{entry.tag}]</span>
              <span className="impact-log__what">{entry.what}</span>
              <span className="impact-log__result"><CountUp value={entry.result} /></span>
            </li>
          ))}
        </ol>
        <p className="impact-log__cmd" aria-hidden="true">:~$ <span className="cursor">█</span></p>
      </div>
    </section>
  );
}

function SectionTitle({ path, title, aside }) {
  return (
    <header className="section-title">
      <p className="muted">~/{path}</p>
      <div>
        <h2>{title}</h2>
        {aside}
      </div>
    </header>
  );
}

function WorkStory({ proof, onNavigate }) {
  return (
    <article className="work-story">
      <div className="work-story__copy">
        <p className="muted">#{proof.index} · {proof.eyebrow.toLowerCase()}</p>
        <h3>{proof.title}</h3>
        <p>{proof.summary}</p>
        <ul>
          {proof.details.map((detail) => <li key={detail}>{detail}</li>)}
        </ul>
        <dl className="work-story__metrics">
          {proof.metrics.map((metric) => (
            <div key={metric.label}><dd>{metric.value}</dd><dt>{metric.label}</dt></div>
          ))}
        </dl>
        {proof.articleSlug ? (
          <RouteLink className="link-arrow" view={{ kind: "post", slug: proof.articleSlug }} onNavigate={onNavigate}>
            read the engineering note →
          </RouteLink>
        ) : (
          <span className="muted">internal system · no public note yet</span>
        )}
      </div>
      <figure className="work-story__visual">
        <figcaption><span>fig.{Number(proof.index)}</span><span className="muted">live · simplified</span></figcaption>
        <div className="scroll-x"><FlowDiagram type={proof.id} label={proof.summary} /></div>
      </figure>
    </article>
  );
}

function RecentWriting({ onNavigate, site }) {
  const state = useWritingIndex();
  if (state.status !== "ready") return null;
  return (
    <section className="home-section" aria-labelledby="writing-title">
      <SectionTitle
        path="writing"
        title={<span id="writing-title">Recent writing</span>}
        aside={<RouteLink className="link-arrow" view={{ kind: "writing" }} onNavigate={onNavigate}>all posts →</RouteLink>}
      />
      <PostList posts={state.value.slice(0, 3)} onNavigate={onNavigate} site={site} />
    </section>
  );
}

function SelectedProjects({ onNavigate }) {
  const { status, projects } = useProjects();
  if (status !== "ready" || !projects.length) return null;
  return (
    <section className="home-section" aria-labelledby="projects-title">
      <SectionTitle
        path="projects"
        title={<span id="projects-title">Built to understand</span>}
        aside={<RouteLink className="link-arrow" view={{ kind: "projects" }} onNavigate={onNavigate}>all projects →</RouteLink>}
      />
      <ProjectList projects={projects.slice(0, 4)} />
    </section>
  );
}

function Contact({ site }) {
  return (
    <section className="home-section contact" id="contact" aria-labelledby="contact-title">
      <SectionTitle path="contact" title={<span id="contact-title">Have a difficult system?</span>} />
      <div className="contact__grid">
        <Typewriter
          lines={[
            "$ whoami",
            "shubham — principal software engineer",
            "$ cat interests.txt",
            "rust, databases, distributed systems, webrtc",
            "$ ping shubham",
            "64 bytes from bengaluru: reply within a day",
          ]}
        />
        <div className="links-file">
          <p className="muted">$ cat ~/.links</p>
          <ul>
            {contactLinks(site).map((link) => (
              <li key={link.label}>
                <span className="links-file__key">{link.label.padEnd(9, " ")}</span>
                <span className="muted">→ </span>
                <a href={link.href} rel="me">{link.text}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function Home({ onNavigate, site }) {
  return (
    <>
      <Hero site={site} onNavigate={onNavigate} />
      <section className="home-section" id="work" aria-labelledby="work-title">
        <SectionTitle
          path="work"
          title={<span id="work-title">Three systems that changed the company</span>}
          aside={<span className="muted">voice · messaging · reliability</span>}
        />
        {workProof.map((proof) => (
          <div key={proof.id}>
            <Dots />
            <WorkStory proof={proof} onNavigate={onNavigate} />
          </div>
        ))}
        <Dots />
        <blockquote className="principle">
          <p>“The goal is not zero failure. It’s a system that <span className="accent">knows what to do next.</span>”</p>
          <footer className="muted">— operating principle 001</footer>
        </blockquote>
      </section>
      <RecentWriting onNavigate={onNavigate} site={site} />
      <SelectedProjects onNavigate={onNavigate} />
      <Contact site={site} />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* About                                                               */
/* ------------------------------------------------------------------ */

function About({ onNavigate, site }) {
  const facts = [
    ["name", site.name],
    ["role", "principal software engineer @ limechat"],
    ["based", "bengaluru, india"],
    ["since", "2017 — first program, on an android phone"],
    ["focus", "distributed systems, reliability, voice ai"],
    ["tools", "rust, python, django, postgres, kafka, rabbitmq, redis, webrtc"],
  ];
  return (
    <>
      <PageHeading title="About" aside={<span className="muted">the longer version</span>} />
      <div className="about-card">
        <div className="about-card__title"><span>whoami</span><span className="muted">~/.profile</span></div>
        <dl>
          {facts.map(([key, value]) => (
            <div key={key}><dt>{key}</dt><dd>{value}</dd></div>
          ))}
          <div>
            <dt>links</dt>
            <dd className="about-card__links">
              {contactLinks(site).map((link) => <a key={link.label} href={link.href} rel="me">{link.label}</a>)}
            </dd>
          </div>
        </dl>
      </div>
      <ol className="timeline">
        <li><span className="accent">2017</span><p>Started programming on an Android phone. The first program came before the first laptop.</p></li>
        <li><span className="accent">2020</span><p>First production backend: search, pub/sub, real-time chat, and infrastructure for real users.</p></li>
        <li><span className="accent">2021 → now</span><p>LimeChat — from backend engineer to principal engineer across messaging, voice, and reliability.</p></li>
      </ol>
      <Dots />
      <MarkdownPage page="about" onNavigate={onNavigate} className="about-prose" />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Shell                                                               */
/* ------------------------------------------------------------------ */

function SiteFooter({ onNavigate, site }) {
  return (
    <footer className="site-footer">
      <Dots />
      <div className="site-footer__grid">
        <pre className="site-footer__mark" aria-hidden="true">{`┌─┐┬┌─
└─┐├┴┐
└─┘┴ ┴`}</pre>
        <nav aria-label="Footer">
          {primaryNav.map((item) => (
            <RouteLink key={item.kind} view={{ kind: item.kind }} onNavigate={onNavigate}>
              <span className="muted">[{item.key}]</span> {item.label.toLowerCase()}
            </RouteLink>
          ))}
        </nav>
        <nav aria-label="Elsewhere">
          {contactLinks(site).map((link) => <a key={link.label} href={link.href} rel="me">{link.label} ↗</a>)}
          <a href={site.admin}>publish ↗</a>
        </nav>
      </div>
      <p className="site-footer__legal muted">
        © {new Date().getFullYear()} {site.name.toLowerCase()} · built with react and too many box-drawing characters · <a href="#top">back to top ↑</a>
      </p>
    </footer>
  );
}

function titleFor(view, articleTitle) {
  if (view.kind === "home") return "Systems, reliability, voice AI";
  if (view.kind === "post") return articleTitle || "Writing";
  if (view.kind === "not-found") return "Not found";
  return primaryNav.find((item) => item.kind === view.kind)?.label;
}

export default function App() {
  const [view, setView] = useState(() => viewFromSearch(globalThis.location.search));
  const [site, setSite] = useState(() => withDerived(defaultSite));
  const [theme, setTheme] = useState(() => {
    try {
      return globalThis.localStorage.getItem("shubh-theme") || "dark";
    } catch {
      return "dark";
    }
  });
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

  // Single-key navigation, shown as [h] [w] [p] [a] in the footer.
  useEffect(() => {
    function handleKey(event) {
      if (event.metaKey || event.ctrlKey || event.altKey || event.repeat) return;
      if (event.target.closest?.("input, textarea, select, [contenteditable]")) return;
      const item = primaryNav.find((entry) => entry.key === event.key);
      if (item) navigate({ kind: item.kind });
    }
    globalThis.addEventListener("keydown", handleKey);
    return () => globalThis.removeEventListener("keydown", handleKey);
  }, [navigate]);

  useEffect(() => {
    const controller = new AbortController();
    fetch("./content/site.json", { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : defaultSite))
      .then((loaded) => setSite(withDerived({ ...defaultSite, ...loaded })))
      .catch(() => {});
    return () => controller.abort();
  }, []);

  useEffect(() => {
    try {
      globalThis.localStorage.setItem("shubh-theme", theme);
    } catch {
      // Storage can be unavailable (private windows); the theme still applies for this visit.
    }
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  useEffect(() => {
    document.title = `${titleFor(view, articleTitle)} — ${site.name}`;
  }, [articleTitle, site.name, view]);

  const onArticleMetadata = useCallback((metadata) => setArticleTitle(metadata.title), []);

  let content;
  if (view.kind === "home") content = <Home onNavigate={navigate} site={site} />;
  else if (view.kind === "writing") content = <WritingIndex onNavigate={navigate} site={site} />;
  else if (view.kind === "post") content = <Article slug={view.slug} onNavigate={navigate} onMetadata={onArticleMetadata} site={site} />;
  else if (view.kind === "projects") content = <ProjectsPage onNavigate={navigate} />;
  else if (view.kind === "about") content = <About onNavigate={navigate} site={site} />;
  else content = <NotFound onNavigate={navigate} />;

  return (
    <div className="site" id="top">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <Announcement onNavigate={navigate} />
      <div className="container">
        <SiteHeader
          view={view}
          onNavigate={navigate}
          site={site}
          theme={theme}
          toggleTheme={() => setTheme((current) => (current === "dark" ? "light" : "dark"))}
        />
        <main id="main-content" className={`main main--${view.kind}`} key={view.kind === "post" ? view.slug : view.kind}>
          {content}
        </main>
        <SiteFooter onNavigate={navigate} site={site} />
      </div>
    </div>
  );
}
