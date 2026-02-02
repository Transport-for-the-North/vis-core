/**
 * Splits text into whitespace-delimited words.
 *
 * @param {unknown} s
 * @returns {string[]}
 */
export function splitWords(s) {
  return String(s ?? "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

/**
 * Builds a "preferred" line that attempts to fit a target character count by
 * concatenating whole words only (never breaks words).
 *
 * @param {unknown} text
 * @param {number} targetChars
 * @returns {string}
 */
export function buildPreferredLine(text, targetChars) {
  const words = splitWords(text);
  if (words.length === 0) return "";

  let out = words[0];
  for (let i = 1; i < words.length; i += 1) {
    if (out.length + 1 + words[i].length > targetChars) break;
    out += ` ${words[i]}`;
  }
  return out;
}

/**
 * Creates DOM-based text measurement functions using the table's computed font.
 *
 * @param {HTMLElement} measureHostEl
 * @param {HTMLElement|null} tableEl
 * @returns {{
 *  measureOneLinePx: (text: unknown, isHeader: boolean) => number,
 *  measureHeaderTwoLineWidthPx: (headerText: unknown, minWidthPx: number, maxWidthPx: number) => number
 * }}
 */
export function makeTextMeasurer(measureHostEl, tableEl) {
  const tableStyle = tableEl ? getComputedStyle(tableEl) : null;

  /**
   * Applies table font styles to a measurement element.
   *
   * @param {HTMLElement} el
   * @param {boolean} isHeader
   * @returns {void}
   */
  const applyFont = (el, isHeader) => {
    if (tableStyle) {
      el.style.fontFamily = tableStyle.fontFamily;
      el.style.fontSize = tableStyle.fontSize;
    }
    el.style.fontWeight = isHeader ? "800" : "400";
  };

  /**
   * Measures single-line width (no wrapping).
   *
   * @param {unknown} text
   * @param {boolean} isHeader
   * @returns {number}
   */
  const measureOneLinePx = (text, isHeader) => {
    const span = document.createElement("span");
    span.textContent = text == null ? "" : String(text);

    applyFont(span, isHeader);

    span.style.whiteSpace = "nowrap";
    span.style.position = "absolute";
    span.style.left = "0";
    span.style.top = "0";
    span.style.padding = isHeader ? "10px 8px" : "6px 8px";

    measureHostEl.appendChild(span);
    const w = span.getBoundingClientRect().width;
    span.remove();
    return w;
  };

  /**
   * Measures the minimal width at which header text fits in <= 2 lines.
   * Wrapping occurs only at spaces (never breaks words).
   *
   * @param {unknown} headerText
   * @param {number} minWidthPx
   * @param {number} maxWidthPx
   * @returns {number}
   */
  const measureHeaderTwoLineWidthPx = (headerText, minWidthPx, maxWidthPx) => {
    const text = headerText == null ? "" : String(headerText);

    const div = document.createElement("div");
    div.textContent = text;

    applyFont(div, true);

    div.style.position = "absolute";
    div.style.left = "0";
    div.style.top = "0";
    div.style.padding = "10px 8px";

    div.style.whiteSpace = "normal";
    div.style.overflowWrap = "normal";
    div.style.wordBreak = "keep-all";
    div.style.hyphens = "none";
    div.style.lineHeight = "1.2";
    div.style.maxWidth = "none";

    measureHostEl.appendChild(div);

    const oneLineHeight = (() => {
      const probe = document.createElement("span");
      probe.textContent = "A";
      applyFont(probe, true);
      probe.style.whiteSpace = "nowrap";
      probe.style.lineHeight = "1.2";
      probe.style.position = "absolute";
      probe.style.padding = "0";
      measureHostEl.appendChild(probe);
      const h = probe.getBoundingClientRect().height;
      probe.remove();
      return h;
    })();

    // Header padding is 10px top + 10px bottom; allow a small tolerance for rounding.
    const twoLineMaxHeight = oneLineHeight * 2 + 20 + 1;

    /**
     * @param {number} wPx
     * @returns {boolean}
     */
    const fitsInTwoLines = (wPx) => {
      div.style.width = `${wPx}px`;
      return div.getBoundingClientRect().height <= twoLineMaxHeight;
    };

    if (!fitsInTwoLines(maxWidthPx)) {
      div.remove();
      return maxWidthPx;
    }

    let lo = Math.max(1, Math.floor(minWidthPx));
    let hi = Math.floor(maxWidthPx);

    while (lo < hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (fitsInTwoLines(mid)) hi = mid;
      else lo = mid + 1;
    }

    div.remove();
    return lo;
  };

  return { measureOneLinePx, measureHeaderTwoLineWidthPx };
}

/**
 * Computes deterministic, content-aware column widths intended to produce
 * "reasonable wrapping" while avoiding extremely wide columns.
 *
 * @param {{
 *  columns: Array<{accessor: string, header: string, type?: 'text'|'number'}>,
 *  filteredRows: any[],
 *  autoFitSampleSize: number,
 *  measureOneLinePx: (text: unknown, isHeader: boolean) => number,
 *  measureHeaderTwoLineWidthPx: (headerText: unknown, minWidthPx: number, maxWidthPx: number) => number,
 *  perColumnMaxPx?: Record<string, number>
 * }} args
 * @returns {Record<number, number>}
 */
export function computeReasonableWrapWidthsPx({
  columns,
  filteredRows,
  autoFitSampleSize,
  measureOneLinePx,
  measureHeaderTwoLineWidthPx,
  perColumnMaxPx,
}) {
  const MIN_PX = 60;
  const DEFAULT_MAX_PX = 520;
  const BUFFER_PX = 16;

  const sample = filteredRows.slice(0, autoFitSampleSize);
  /** @type {Record<number, number>} */
  const next = {};

  for (let i = 0; i < columns.length; i += 1) {
    const c = columns[i];
    const maxPx = perColumnMaxPx?.[c.accessor] ?? DEFAULT_MAX_PX;

    // Ensure no word is forced to break by sizing to the longest word.
    let longestWord = "";
    for (const w of splitWords(c.header)) if (w.length > longestWord.length) longestWord = w;

    for (let r = 0; r < sample.length; r += 1) {
      const cellText = sample[r]?.[c.accessor];
      for (const w of splitWords(cellText)) if (w.length > longestWord.length) longestWord = w;
    }

    const longestWordPx = measureOneLinePx(longestWord, true);

    // Compute the minimal width that keeps the header to <= 2 lines.
    const headerTwoLinePx = measureHeaderTwoLineWidthPx(
      c.header,
      Math.max(MIN_PX, longestWordPx),
      maxPx
    );

    // Favor wrapping body content by sizing to a preferred line length.
    const targetChars = c.type === "number" ? 10 : 28;
    let longestText = "";
    for (let r = 0; r < sample.length; r += 1) {
      const s = String(sample[r]?.[c.accessor] ?? "");
      if (s.length > longestText.length) longestText = s;
    }

    const preferredLine = buildPreferredLine(longestText, targetChars);
    const preferredLinePx = measureOneLinePx(preferredLine, false);

    const raw = Math.max(longestWordPx, headerTwoLinePx, preferredLinePx) + BUFFER_PX;
    next[i] = Math.round(Math.max(MIN_PX, Math.min(maxPx, raw)));
  }

  return next;
}

/**
 * Merges width maps by expanding only:
 * - Keeps the previous width if it's larger
 * - Takes the required width if it's larger (or if previous is missing)
 *
 * @param {Record<number, number>} prevPx
 * @param {Record<number, number>} requiredPx
 * @param {number} columnCount
 * @returns {Record<number, number>}
 */
export function mergeExpandOnly(prevPx, requiredPx, columnCount) {
  /** @type {Record<number, number>} */
  const out = { ...prevPx };

  for (let i = 0; i < columnCount; i += 1) {
    const prev = prevPx?.[i];
    const req = requiredPx?.[i];
    if (req == null) continue;
    out[i] = prev == null ? req : Math.max(prev, req);
  }

  return out;
}