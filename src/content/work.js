export const workProof = [
  {
    id: "voice",
    index: "01",
    eyebrow: "NEW PRODUCT / VOICE AI",
    title: "I started LimeChat’s voice product.",
    summary:
      "I architected the platform that lets a customer call a business and speak to a LimeChat AI agent, then built the missing WhatsApp-to-LiveKit media bridge that made the product possible.",
    details: [
      "Took the product from protocol research and prototype to enterprise production.",
      "Ported the Python media bridge to Rust, reducing CPU usage by 80%.",
      "Made LimeChat the first company in India to offer AI-handled WhatsApp calls.",
    ],
    metrics: [
      { value: "$600K+", label: "revenue attributed" },
      { value: "≈10", label: "enterprise deals" },
    ],
    articleSlug: "story-of-how-we-built-voice-agents-at-limechat",
  },
  {
    id: "ums",
    index: "02",
    eyebrow: "FOUNDATIONAL SYSTEM / MESSAGING",
    title: "One message system for every product.",
    summary:
      "I designed and scaled the Unified Messages System: the shared contract between LimeChat’s internal products and the external channels where customer conversations happen.",
    details: [
      "Unified product-specific message paths behind one system boundary.",
      "Designed delivery, state, retries, and idempotent recovery for partial failure.",
      "Led three engineers while shipping UMS alongside two other revenue-critical products.",
    ],
    metrics: [
      { value: "100M+", label: "messages / day" },
      { value: "1B", label: "requests / day" },
    ],
    articleSlug: null,
  },
  {
    id: "reliability",
    index: "03",
    eyebrow: "COMPANY-WIDE INITIATIVE / RELIABILITY",
    title: "We taught overloaded systems to protect themselves.",
    summary:
      "I led reliability work across queues, caches, databases, and services so a struggling dependency could fail locally instead of taking the company down with it.",
    details: [
      "Added circuit breakers across Kafka, RabbitMQ, Redis, caches, and databases.",
      "Designed fallback queue paths that reroute work away from overwhelmed primaries.",
      "Added resource alerts and moved old transactional data out of hot databases.",
    ],
    metrics: [
      { value: "0", label: "queue-overload outages" },
      { value: "15s → 5s", label: "peak agent latency" },
    ],
    articleSlug: "improving-resilience-at-limechat",
  },
];
