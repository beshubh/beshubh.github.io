export const options = ["rust", "python", "go", "typescript", "postgres", "kafka", "redis", "rabbitmq"];

// Each highlight leads with the number it moved. Keep every figure traceable to
// content/pages/about.md or a published post; do not round up.
export const experience = [
  {
    company: "LimeChat",
    note: "(YC W21)",
    role: "Principal Software Engineer",
    dates: "2021 — 2026",
    highlights: [
      {
        result: "100M+ msgs/day",
        text: "Designed the Unified Messages System that every LimeChat product sends through. It handles 100M+ messages and 1B requests a day.",
      },
      {
        result: "$600K revenue",
        text: "Started the voice AI product, which brought in $600K+ and about 10 enterprise deals. We were the first company in India to put AI agents on WhatsApp calls.",
      },
      {
        result: "−80% CPU",
        text: "Rewrote the WhatsApp-to-LiveKit audio bridge from Python to Rust. Pods shrank from 2 vCPU / 1 GB to 0.5 vCPU / 200 MB, and the usual replica count from 4–10 to 2.",
      },
      {
        result: "90% → 40%",
        text: "Put PgBouncer in front of Postgres across several services. Database CPU fell from 90% to 40% and open connections from 5K to 3K.",
      },
      {
        result: "15s → 5s",
        text: "Cut peak chat-agent latency with the Agents Studio team by adding semantic caching and removing high-fanout database reads.",
      },
      {
        result: "60K → 1M",
        text: "Removed a years-old bottleneck in CRM broadcasts, raising campaign size from 60K to 1M messages.",
      },
      {
        result: "0 queue outages",
        text: "Led the reliability push: circuit breakers on Kafka, RabbitMQ, Redis and Postgres, plus fallback queues for when a primary backs up. Queue-overload outages stopped.",
      },
    ],
    path: "SDE → SDE-II → Architect → Principal",
  },
  {
    company: "ClassCast",
    role: "Backend Developer",
    dates: "2020 — 2021",
    highlights: [
      {
        result: "100K+ students",
        text: "Rebuilt the course-hosting backend from scratch on Django, MySQL and Redis, and shipped it in three months.",
      },
    ],
  },
  { company: "The Tarzan Way", role: "Backend Intern", dates: "2020" },
];
