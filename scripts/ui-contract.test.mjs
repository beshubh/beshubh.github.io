import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const styles = await readFile(path.join(root, "src", "styles.css"), "utf8");
const desktopWindow = await readFile(path.join(root, "src", "components", "DesktopWindow.jsx"), "utf8");

assert.match(
  styles,
  /\.desktop-window\[hidden\]\s*\{[^}]*display:\s*none\s*!important;/s,
  "Minimized windows must have an explicit author-level display rule; .desktop-window uses display:grid and otherwise overrides the browser's hidden default.",
);

assert.match(
  desktopWindow,
  /function handleWindowPointerDown\(event\) \{\s*if \(event\.target\.closest\("a, button, input, textarea, select, \[contenteditable\]"\)\) return;\s*onFocus\(\);\s*\}/s,
  "Pointer-down on an interactive control must not focus and re-render its window before the browser can emit click.",
);
assert.match(
  desktopWindow,
  /onPointerDown=\{handleWindowPointerDown\}/,
  "The desktop window must use the link-safe focus handler.",
);
