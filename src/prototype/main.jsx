import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import messageCore from "./assets/message-core.png";
import "./prototype.css";

const work = [
  {
    id: "01",
    eyebrow: "FOUNDATIONAL SYSTEM / LIMECHAT",
    title: "One message core,\nevery product.",
    metric: "100M+ messages / day",
    secondMetric: "1B requests / day",
    body: [
      "Designed the Unified Messages System used across LimeChat. It became the shared layer for message state, delivery, and product integrations.",
      "The difficult part was not moving messages. It was keeping semantics predictable while queues, vendors, databases, and traffic behaved unpredictably.",
    ],
    bullets: [
      "Unified product-specific message paths behind one contract",
      "Built for partial failure, retries, and idempotent recovery",
      "Made operational state visible before it became an incident",
    ],
    visual: "core",
  },
  {
    id: "02",
    eyebrow: "VOICE INFRASTRUCTURE / NEW TERRITORY",
    title: "Audio crossed a boundary\nthat did not exist yet.",
    metric: "$600K+ revenue",
    secondMetric: "≈10 enterprise deals",
    body: [
      "Built the infrastructure behind AI voice agents and a real-time bridge between WhatsApp calling and LiveKit—before there was a standard route between them.",
      "The first version proved the path. The Rust version made it economical enough to live on the hot path.",
    ],
    bullets: [
      "Shipped the bridge from protocol research to production",
      "Rewrote the media path in Rust",
      "Reduced CPU use by 80% without changing the product contract",
    ],
    visual: "voice",
  },
  {
    id: "03",
    eyebrow: "RELIABILITY / PRESSURE MANAGEMENT",
    title: "Failure became a state,\nnot a surprise.",
    metric: "15s → 6s",
    secondMetric: "peak agent latency",
    body: [
      "Led a reliability program across Kafka, RabbitMQ, Redis, caches, and databases. Circuit breakers and fallback queues kept overload local.",
      "On the response path, semantic caching and fewer high-fanout reads removed work that the system never needed to repeat.",
    ],
    bullets: [
      "Contained dependency pressure before it cascaded",
      "Eliminated queue-overload outages on critical paths",
      "Cut peak AI-agent response latency by more than half",
    ],
    visual: "reliability",
  },
];

const projects = [
  ["HARVEST", "Search engine / Rust", "crawler · SPIMI · phrase queries"],
  ["KAFKA-RS", "Protocol study / Rust", "broker · log · consumer groups"],
  ["RSLOX", "Language runtime / Rust", "scanner · parser · interpreter"],
  ["DISTSYS-RUST", "Systems notebook", "consensus · storage · failure"],
];

const writing = [
  ["01", "Celery, retries, and the semantics hiding in a task queue", "Reliability"],
  ["02", "Building a search engine in Rust, one index at a time", "Systems"],
  ["03", "What production voice agents actually need", "Voice AI"],
  ["04", "Resilience is a product decision before it is a code decision", "Engineering"],
];

function NetworkDiagram() {
  return (
    <svg className="network-diagram" viewBox="0 0 620 620" aria-label="Message system topology">
      <g className="network-orbits">
        <circle cx="310" cy="310" r="240" />
        <circle cx="310" cy="310" r="160" />
        <circle cx="310" cy="310" r="78" />
      </g>
      <g className="network-links">
        <path d="M310 70L310 232M310 388L310 550M70 310L232 310M388 310L550 310" />
        <path d="M140 140L255 255M365 365L480 480M480 140L365 255M255 365L140 480" />
      </g>
      <g className="network-nodes">
        <circle cx="310" cy="70" r="8" /><circle cx="310" cy="550" r="8" />
        <circle cx="70" cy="310" r="8" /><circle cx="550" cy="310" r="8" />
        <circle cx="140" cy="140" r="8" /><circle cx="480" cy="480" r="8" />
        <circle cx="480" cy="140" r="8" /><circle cx="140" cy="480" r="8" />
        <circle className="network-core" cx="310" cy="310" r="30" />
      </g>
      <g className="network-labels">
        <text x="310" y="43">INGRESS</text><text x="310" y="584">DELIVERY</text>
        <text x="36" y="289">STATE</text><text x="584" y="289">EVENTS</text>
        <text x="310" y="314">CORE</text>
      </g>
    </svg>
  );
}

function VoiceDiagram() {
  return (
    <div className="voice-diagram" aria-label="WhatsApp to LiveKit media bridge">
      <div className="voice-endpoint">
        <small>EDGE / A</small><strong>WHATSAPP</strong><span>encoded audio</span>
      </div>
      <div className="voice-bridge">
        <span>jitter</span><i /><i /><i /><i /><i /><b>RUST BRIDGE</b><i /><i /><i /><i /><i /><span>frames</span>
      </div>
      <div className="voice-endpoint">
        <small>EDGE / B</small><strong>LIVEKIT</strong><span>realtime room</span>
      </div>
      <p><span>PYTHON</span><del>████████████████████</del> 100% CPU<br /><span>RUST</span><ins>████</ins> 20% CPU</p>
    </div>
  );
}

function ReliabilityDiagram() {
  return (
    <div className="reliability-diagram" aria-label="Reliability fallback sequence">
      <div className="reliability-flow">
        {["REQUEST", "PRIMARY", "BREAKER", "FALLBACK", "RECOVERY"].map((label, index) => (
          <div key={label} className={index === 2 ? "tripped" : ""}>
            <i>{String(index + 1).padStart(2, "0")}</i><span>{label}</span><b />
          </div>
        ))}
      </div>
      <svg viewBox="0 0 700 190" preserveAspectRatio="none" aria-label="Latency graph from 15 to 6 seconds">
        <g className="chart-grid">
          <path d="M0 35H700M0 95H700M0 155H700" />
        </g>
        <path className="chart-before" d="M0 28 C90 38 130 22 210 44 S340 66 410 62 S530 90 700 88" />
        <path className="chart-after" d="M0 50 C90 74 160 92 230 118 S370 138 460 142 S590 150 700 151" />
        <text x="10" y="18">15.0s</text><text x="645" y="178">6.0s</text>
      </svg>
    </div>
  );
}

function WorkVisual({ type }) {
  if (type === "core") return <NetworkDiagram />;
  if (type === "voice") return <VoiceDiagram />;
  return <ReliabilityDiagram />;
}

function ThemeToggle({ theme, setTheme }) {
  return (
    <button className="theme-toggle" type="button" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
      [ {theme === "dark" ? "LIGHT" : "DARK"} ]
    </button>
  );
}

function Portfolio() {
  const [theme, setTheme] = useState(() => localStorage.getItem("prototype-theme") || "dark");

  useEffect(() => {
    localStorage.setItem("prototype-theme", theme);
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  return (
    <main className="portfolio" data-theme={theme} id="top">
      <div className="page-frame" aria-hidden="true" />

      <div className="announcement">
        <span>~ PRINCIPAL SOFTWARE ENGINEER / BENGALURU, INDIA</span>
        <a href="mailto:bshubh@proton.me">AVAILABLE FOR THE RIGHT PROBLEM &gt;&gt;</a>
      </div>

      <header className="site-header">
        <a className="identity" href="#top">
          <strong>SHUBHAM KUMAR</strong>
          <span>SYSTEMS / RELIABILITY<br />VOICE AI / RUST</span>
        </a>
        <nav aria-label="Primary navigation">
          <a href="#work">[ WORK ]</a>
          <a href="#lab">[ LAB ]</a>
          <a href="#writing">[ WRITING ]</a>
          <a href="https://github.com/beshubh">[ GITHUB ↗ ]</a>
          <ThemeToggle theme={theme} setTheme={setTheme} />
        </nav>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <span className="section-id">~/ABOUT</span>
          <p className="copyright">~*~ SYSTEMS BUILT BY SHUBHAM KUMAR ~*~</p>
          <h1>I build software that stays useful when reality stops cooperating.</h1>
          <p className="hero-body">
            Principal software engineer working on distributed systems, reliability,
            performance, and AI infrastructure. I like the part after the happy path.
          </p>
          <div className="hero-links">
            <a href="#work">READ THE FIELD NOTES ↓</a>
            <a href="mailto:bshubh@proton.me">SEND A MESSAGE ↗</a>
          </div>
        </div>

        <figure className="artifact">
          <img src={messageCore} alt="Abstract interlocking metal sculpture representing a resilient message-processing core" />
          <figcaption className="artifact-label artifact-label-a">MESSAGE CORE<br />REV. 04</figcaption>
          <figcaption className="artifact-label artifact-label-b">FAILURE IS<br />ROUTABLE</figcaption>
          <div className="artifact-marker"><i /><span>100M+ / DAY</span></div>
        </figure>

        <div className="hero-status">
          <span>STATUS: BUILDING</span><span>LOCAL TIME: IST</span><span>SCROLL ↓</span>
        </div>
      </section>

      <section className="manifesto">
        <span>OPERATING PRINCIPLE / 001</span>
        <blockquote>
          “The goal is not zero failure.<br />
          It’s a system that <em>knows what to do next.</em>”
        </blockquote>
      </section>

      <section className="work" id="work">
        <header className="section-header">
          <span>~/SELECTED-WORK</span>
          <p>THREE SYSTEMS / ONE QUESTION:<br />WHAT HAPPENS UNDER PRESSURE?</p>
        </header>

        {work.map((item) => (
          <article className="case-study" key={item.id}>
            <div className="case-copy">
              <span className="case-number"># {item.id} / 03</span>
              <small>{item.eyebrow}</small>
              <h2>{item.title.split("\n").map((line) => <span key={line}>{line}</span>)}</h2>
              {item.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              <ul>
                {item.bullets.map((bullet) => <li key={bullet}>* {bullet}</li>)}
              </ul>
              <dl>
                <div><dt>PRIMARY SIGNAL</dt><dd>{item.metric}</dd></div>
                <div><dt>SECONDARY</dt><dd>{item.secondMetric}</dd></div>
              </dl>
            </div>
            <div className="case-visual">
              <div className="visual-header"><span>FIG. {item.id}</span><span>NOT TO SCALE</span></div>
              <WorkVisual type={item.visual} />
              <p>ENGINEERING NOTE / THE SHAPE CHANGES. THE INVARIANTS SHOULD NOT.</p>
            </div>
          </article>
        ))}
      </section>

      <section className="lab" id="lab">
        <header className="section-header">
          <span>~/SYSTEMS-LAB</span>
          <p>SMALL MACHINES BUILT<br />TO UNDERSTAND LARGE ONES.</p>
        </header>
        <div className="lab-layout">
          <div className="ascii-art" aria-label="ASCII packet sculpture">
            <pre>{`                 .----.
             .--'  01  '--.
          .-'  00   ◉   10  '-.
        .'   ┌─────────────┐    '.
       /     │  APPEND LOG │      \\
      ;   ◌──┤  [:::::::]  ├──◌    ;
      |      │  [:::::::]  │       |
      ;   ◌──┤  [:::::::]  ├──◌    ;
       \\     └─────────────┘      /
        '.       11 / ACK       .'
          '-.               .-'
             '--._______.--'`}</pre>
            <span>PACKET STUDY / 2026</span>
          </div>
          <div className="project-index">
            {projects.map(([name, type, detail], index) => (
              <a href="https://github.com/beshubh" key={name}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{name}</strong>
                <p>{type}</p>
                <small>{detail}</small>
                <b>↗</b>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="writing" id="writing">
        <header className="section-header">
          <span>~/FIELD-NOTES</span>
          <p>WRITING IS HOW A SYSTEM<br />BECOMES UNDERSTANDABLE TWICE.</p>
        </header>
        <div className="writing-list">
          {writing.map(([id, title, category]) => (
            <a href="#" key={id}>
              <span>{id}</span><h3>{title}</h3><small>{category}</small><b>READ ↗</b>
            </a>
          ))}
        </div>
      </section>

      <footer>
        <div>
          <span>~/CONTACT</span>
          <h2>Have a difficult system?</h2>
          <a href="mailto:bshubh@proton.me">bshubh@proton.me ↗</a>
        </div>
        <p>SHUBHAM KUMAR<br />BENGALURU / INDIA<br />© 2026</p>
        <nav>
          <a href="https://github.com/beshubh">GITHUB ↗</a>
          <a href="#">LINKEDIN ↗</a>
          <a href="#top">BACK TO TOP ↑</a>
        </nav>
      </footer>
    </main>
  );
}

createRoot(document.getElementById("prototype-root")).render(<Portfolio />);
