import { useEffect, useRef, useState } from "react";

const reducedMotion = () => globalThis.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

// Runs `tick(elapsedMs)` on animation frames at roughly `fps`, only while `ref` is on screen.
function useVisibleTicker(ref, fps, tick) {
  const tickRef = useRef(tick);
  tickRef.current = tick;

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    if (reducedMotion()) {
      tickRef.current(0);
      return undefined;
    }

    let frame = 0;
    let visible = false;
    let last = 0;
    const start = performance.now();
    const interval = 1000 / fps;

    function loop(now) {
      frame = requestAnimationFrame(loop);
      if (!visible || now - last < interval) return;
      last = now;
      tickRef.current(now - start);
    }

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    observer.observe(node);
    frame = requestAnimationFrame(loop);
    tickRef.current(0);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [ref, fps]);
}

/* ------------------------------------------------------------------ */
/* Banner: ANSI Shadow letters that decrypt into place.                */
/* ------------------------------------------------------------------ */

const glyphs = {
  S: ["███████╗", "██╔════╝", "███████╗", "╚════██║", "███████║", "╚══════╝"],
  H: ["██╗  ██╗", "██║  ██║", "███████║", "██╔══██║", "██║  ██║", "╚═╝  ╚═╝"],
  U: ["██╗   ██╗", "██║   ██║", "██║   ██║", "██║   ██║", "╚██████╔╝", " ╚═════╝ "],
  B: ["██████╗ ", "██╔══██╗", "██████╔╝", "██╔══██╗", "██████╔╝", "╚═════╝ "],
  A: [" █████╗ ", "██╔══██╗", "███████║", "██╔══██║", "██║  ██║", "╚═╝  ╚═╝"],
  M: ["███╗   ███╗", "████╗ ████║", "██╔████╔██║", "██║╚██╔╝██║", "██║ ╚═╝ ██║", "╚═╝     ╚═╝"],
};

export function bannerLines(word) {
  return glyphs.S.map((_, row) => [...word].map((letter) => glyphs[letter][row]).join(""));
}

const noise = "!<>-_\\/[]{}=+*^?#$%&@01";

export function DecryptBanner({ word = "SHUBHAM", label }) {
  const target = bannerLines(word);
  const width = target[0].length;
  const ref = useRef(null);
  const [lines, setLines] = useState(() => (reducedMotion() ? target : target.map((line) => line.replace(/\S/g, " "))));
  const done = useRef(false);

  useVisibleTicker(ref, 30, (elapsed) => {
    if (done.current) return;
    const revealed = elapsed === 0 && reducedMotion() ? width : Math.floor(elapsed / 18);
    if (revealed >= width + 8) {
      done.current = true;
      setLines(target);
      return;
    }
    setLines(target.map((line) => [...line].map((char, column) => {
      if (char === " ") return " ";
      if (column < revealed) return char;
      if (column < revealed + 8) return noise[(Math.random() * noise.length) | 0];
      return " ";
    }).join("")));
  });

  return (
    <pre ref={ref} className="ascii-banner" role="img" aria-label={label || word}>
      {lines.join("\n")}
    </pre>
  );
}

/* ------------------------------------------------------------------ */
/* Torus: the classic spinning donut, rendered in luminance characters. */
/* ------------------------------------------------------------------ */

const shade = ".,-~:;=!*#$@";

function renderTorus(a, b, columns, rows) {
  const output = new Array(columns * rows).fill(" ");
  const depth = new Array(columns * rows).fill(0);
  const [sinA, cosA, sinB, cosB] = [Math.sin(a), Math.cos(a), Math.sin(b), Math.cos(b)];
  const scale = columns * 0.52;

  for (let theta = 0; theta < 6.28; theta += 0.07) {
    const [sinT, cosT] = [Math.sin(theta), Math.cos(theta)];
    for (let phi = 0; phi < 6.28; phi += 0.02) {
      const [sinP, cosP] = [Math.sin(phi), Math.cos(phi)];
      const circle = cosT + 2;
      const inverseZ = 1 / (sinP * circle * sinA + sinT * cosA + 5);
      const t = sinP * circle * cosA - sinT * sinA;
      // Terminal cells are ~0.6em wide and ~1.05em tall, so squash y to keep the torus round.
      const x = (columns / 2 + scale * inverseZ * (cosP * circle * cosB - t * sinB)) | 0;
      const y = (rows / 2 + scale * 0.57 * inverseZ * (cosP * circle * sinB + t * cosB)) | 0;
      const index = x + columns * y;
      const light = (8 * ((sinT * sinA - sinP * cosT * cosA) * cosB - sinP * cosT * sinA - sinT * cosA - cosP * cosT * sinB)) | 0;
      if (y >= 0 && y < rows && x >= 0 && x < columns && inverseZ > depth[index]) {
        depth[index] = inverseZ;
        output[index] = shade[Math.max(light, 0)];
      }
    }
  }

  const lines = [];
  for (let row = 0; row < rows; row += 1) lines.push(output.slice(row * columns, (row + 1) * columns).join(""));
  return lines.join("\n");
}

export function Torus({ columns = 70, rows = 30 }) {
  const ref = useRef(null);
  const [frame, setFrame] = useState(() => renderTorus(1, 1, columns, rows));

  useVisibleTicker(ref, 30, (elapsed) => {
    setFrame(renderTorus(1 + elapsed * 0.0009, 1 + elapsed * 0.00045, columns, rows));
  });

  return <pre ref={ref} className="ascii-torus" aria-hidden="true">{frame}</pre>;
}

/* ------------------------------------------------------------------ */
/* Flow diagrams: box-drawing templates with packets moving on lanes.  */
/* ------------------------------------------------------------------ */

// Characters wrapped in ⟦ ⟧ are rendered hot; ● is a packet.
function Frame({ lines }) {
  return lines.map((line, row) => {
    const parts = line.split(/(⟦[^⟧]*⟧|●)/);
    return (
      <span className="flow-line" key={row}>
        {parts.map((part, index) => {
          if (part === "●") return <b className="flow-packet" key={index}>●</b>;
          if (part.startsWith("⟦")) return <b className="flow-hot" key={index}>{part.slice(1, -1)}</b>;
          return part;
        })}
        {"\n"}
      </span>
    );
  });
}

function placePackets(template, lanes, step) {
  const grid = template.map((line) => [...line]);
  for (const lane of lanes) {
    const length = Math.abs(lane.to - lane.from) + 1;
    const direction = lane.to >= lane.from ? 1 : -1;
    const spacing = lane.spacing || 7;
    const cycle = Math.ceil(length / spacing) * spacing;
    for (let offset = 0; offset < cycle; offset += spacing) {
      const position = (step + offset + (lane.phase || 0)) % cycle;
      if (position >= length) continue;
      const column = lane.from + direction * position;
      if ("─━═".includes(grid[lane.row][column])) grid[lane.row][column] = "●";
    }
  }
  return grid.map((line) => line.join(""));
}

// Lays out boxes left to right, joined by `gap`-wide wires. Returns the lines and each wire's column span.
function boxRow(boxes, gap = 6) {
  const width = (box) => Math.max(...box.map((line) => line.length)) + 4;
  const lines = ["", "", "", "", ""];
  const wires = [];
  boxes.forEach((box, index) => {
    const inner = width(box) - 2;
    const pad = (text) => `│ ${text.padEnd(inner - 2)} │`;
    const rows = [`┌${"─".repeat(inner)}┐`, pad(box[0]), pad(box[1]), pad(box[2]), `└${"─".repeat(inner)}┘`];
    const last = index === boxes.length - 1;
    const start = lines[0].length + width(box);
    rows.forEach((row, line) => {
      let joint = " ".repeat(gap);
      if (!last && line === 2) joint = `${"─".repeat(gap - 1)}>`;
      if (!last && line === 3) joint = `<${"─".repeat(gap - 1)}`;
      lines[line] += row + (last ? "" : joint);
    });
    if (!last) wires.push([start, start + gap - 1]);
  });
  return { lines, wires };
}

const voice = boxRow([
  ["CALLER", "", "tel +91..."],
  ["WHATSAPP", "webrtc", "srtp / ice"],
  ["RUST BRIDGE", "opus <> pcm", "jitter . vad"],
  ["LIVEKIT", "ai agent", "stt llm tts"],
]);

const voiceTemplate = [
  ...voice.lines,
  "",
  "  full-duplex audio in 20ms frames · cpu ⟦-80%⟧ after the rust port",
];

const voiceLanes = voice.wires.flatMap(([from, to], index) => [
  { row: 2, from, to: to - 1, spacing: 3, phase: index },
  { row: 3, from: to, to: from + 1, spacing: 3, phase: index + 1 },
]);

const umsTemplate = [
  " web chat  ───┐                                  ┌───> whatsapp",
  " crm       ───┤                                  ├───> instagram",
  " agents    ───┤     ╔════════════════════════╗   ├───> messenger",
  " campaigns ───┼────>║   UNIFIED MESSAGES     ║───┼───> sms",
  " workflows ───┤     ║ retry · dedupe · state ║   ├───> email",
  " voice     ───┘     ╚════════════════════════╝   └───> webhooks",
  "",
  "  one contract between every product and every channel",
  "  throughput ⟦100M+ msgs/day⟧ · ⟦1B req/day⟧",
];

const umsLanes = [
  ...[0, 1, 2, 3, 4, 5].map((row) => ({ row, from: 11, to: 13, spacing: 3, phase: row })),
  { row: 3, from: 15, to: 18, spacing: 4 },
  { row: 3, from: 45, to: 48, spacing: 4 },
  ...[0, 1, 2, 3, 4, 5].map((row) => ({ row, from: 50, to: 52, spacing: 3, phase: row * 2 })),
];

function voiceFrame(step) {
  return placePackets(voiceTemplate, voiceLanes, step);
}

function umsFrame(step) {
  return placePackets(umsTemplate, umsLanes, step);
}

// A scripted incident: load climbs, the breaker trips, work reroutes, the primary drains.
function reliabilityFrame(step) {
  const cycle = step % 110;
  const open = cycle >= 44 && cycle < 80;
  const recovering = cycle >= 80;
  const load = cycle < 44 ? 30 + cycle * 1.6 : open ? 100 - (cycle - 44) * 1.8 : 35;
  const fallback = open ? 15 + (cycle - 44) * 1.4 : recovering ? Math.max(0, 65 - (cycle - 80) * 3) : 0;
  const bar = (value) => {
    const filled = Math.round(Math.min(value, 100) / 10);
    return `${"█".repeat(filled)}${"░".repeat(10 - filled)} ${String(Math.round(value)).padStart(3)}%`;
  };
  const state = open ? "OPEN     " : recovering ? "HALF-OPEN" : "CLOSED   ";

  const template = [
    "                 ┌───────────────────┐",
    ` producers ─────>│ breaker ${state} │──────────────> primary   ${bar(load)}`,
    "                 └─────────┬─────────┘",
    "                           │",
    `                           └────────────────────> fallback  ${bar(fallback)}`,
    "",
    open
      ? "  ⟦primary overloaded⟧ -> rerouting to fallback queue, databases protected"
      : recovering
        ? "  probe ok -> primary recovered, fallback draining"
        : "  nominal · watching queue depth, cpu, memory, bandwidth",
  ];

  const lanes = [{ row: 1, from: 11, to: 15, spacing: 3 }];
  if (open) lanes.push({ row: 4, from: 28, to: 46, spacing: 4 });
  else lanes.push({ row: 1, from: 38, to: 50, spacing: recovering ? 6 : 4 });
  return placePackets(template, lanes, step);
}

const diagrams = { voice: voiceFrame, ums: umsFrame, reliability: reliabilityFrame };

export function FlowDiagram({ type, label }) {
  const ref = useRef(null);
  const draw = diagrams[type];
  const [lines, setLines] = useState(() => draw(0));

  useVisibleTicker(ref, 8, (elapsed) => setLines(draw(Math.floor(elapsed / 125))));

  return (
    <pre ref={ref} className="flow-diagram" role="img" aria-label={label}>
      <Frame lines={lines} />
    </pre>
  );
}

/* ------------------------------------------------------------------ */
/* Small pieces                                                        */
/* ------------------------------------------------------------------ */

export function Typewriter({ lines, speed = 28 }) {
  const ref = useRef(null);
  const total = lines.join("\n").length;
  const [count, setCount] = useState(() => (reducedMotion() ? total : 0));

  useVisibleTicker(ref, 60, (elapsed) => {
    setCount((current) => (current >= total ? current : Math.min(total, Math.floor(elapsed / speed))));
  });

  const text = lines.join("\n").slice(0, count);
  return (
    <pre ref={ref} className="typewriter" aria-label={lines.join(" ")}>
      <span aria-hidden="true">{text}</span>
      <span className="cursor" aria-hidden="true">█</span>
    </pre>
  );
}

export function CountUp({ value, duration = 1400 }) {
  const match = String(value).match(/^([^\d]*)([\d.]+)(.*)$/);
  const ref = useRef(null);
  const [shown, setShown] = useState(() => (match && !reducedMotion() ? `${match[1]}0${match[3]}` : value));
  const done = useRef(!match);

  useVisibleTicker(ref, 30, (elapsed) => {
    if (done.current) return;
    const progress = Math.min(1, elapsed / duration);
    const eased = 1 - (1 - progress) ** 3;
    const number = Number(match[2]) * eased;
    const decimals = match[2].includes(".") ? match[2].split(".")[1].length : 0;
    setShown(`${match[1]}${number.toFixed(decimals)}${match[3]}`);
    if (progress === 1) done.current = true;
  });

  return <span ref={ref}>{shown}</span>;
}

export function Clock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  const time = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "Asia/Kolkata",
  }).format(now);
  return <time>{time} IST</time>;
}
