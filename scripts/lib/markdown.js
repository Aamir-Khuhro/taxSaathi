/* Minimal Markdown for Knowledge articles (no dependencies).
 * Supports: front matter (key: value), # headings, paragraphs, - and 1. lists,
 * > quotes, ---, **bold**, *italic*, `code` and [links](url). */
const { esc, slugify } = require("./util");

function frontMatter(src) {
  const m = src.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!m) return { data: {}, body: src };
  const data = {};
  m[1].split(/\r?\n/).forEach((line) => {
    const k = line.match(/^([A-Za-z_]+)\s*:\s*(.*)$/);
    if (!k) return;
    let v = k[2].trim().replace(/^["']|["']$/g, "");
    if (v === "true") v = true; else if (v === "false") v = false;
    data[k[1]] = v;
  });
  return { data, body: src.slice(m[0].length) };
}

function inline(s) {
  let h = esc(s);
  h = h.replace(/`([^`]+)`/g, "<code>$1</code>");
  h = h.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  h = h.replace(/(^|[^*])\*([^*\s][^*]*)\*/g, "$1<em>$2</em>");
  h = h.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, t, u) => {
    const external = /^https?:\/\//.test(u);
    return `<a href="${u}"${external ? ' target="_blank" rel="noopener noreferrer"' : ""}>${t}</a>`;
  });
  return h;
}

// Returns { html, headings: [{ level, text, id }], words }
function render(md) {
  md = md.replace(/<!--[\s\S]*?-->/g, "");
  const lines = md.replace(/\r/g, "").split("\n");
  const out = [], headings = [], used = {};
  let para = [], list = null, quote = [];
  const flushPara = () => { if (para.length) { out.push(`<p>${inline(para.join(" "))}</p>`); para = []; } };
  const flushList = () => { if (list) { out.push(`<${list.tag}>${list.items.map((i) => `<li>${inline(i)}</li>`).join("")}</${list.tag}>`); list = null; } };
  const flushQuote = () => { if (quote.length) { out.push(`<blockquote><p>${inline(quote.join(" "))}</p></blockquote>`); quote = []; } };
  const flushAll = () => { flushPara(); flushList(); flushQuote(); };

  for (const raw of lines) {
    const line = raw.trimEnd();
    let m;
    if (!line.trim()) { flushAll(); continue; }
    if ((m = line.match(/^(#{2,4})\s+(.*)$/))) {
      flushAll();
      const level = m[1].length, text = m[2].trim();
      let id = slugify(text); used[id] = (used[id] || 0) + 1; if (used[id] > 1) id += "-" + used[id];
      headings.push({ level, text, id });
      out.push(`<h${level} id="${id}">${inline(text)}</h${level}>`);
    } else if (/^---+$/.test(line.trim())) { flushAll(); out.push("<hr>"); }
    else if ((m = line.match(/^\s*[-*]\s+(.*)$/))) {
      flushPara(); flushQuote();
      if (!list || list.tag !== "ul") { flushList(); list = { tag: "ul", items: [] }; }
      list.items.push(m[1]);
    } else if ((m = line.match(/^\s*\d+[.)]\s+(.*)$/))) {
      flushPara(); flushQuote();
      if (!list || list.tag !== "ol") { flushList(); list = { tag: "ol", items: [] }; }
      list.items.push(m[1]);
    } else if ((m = line.match(/^>\s?(.*)$/))) { flushPara(); flushList(); quote.push(m[1]); }
    else if (list && /^\s{2,}\S/.test(raw)) { list.items[list.items.length - 1] += " " + line.trim(); }
    else { flushList(); flushQuote(); para.push(line.trim()); }
  }
  flushAll();
  const words = md.replace(/[#>*`\-\[\]()]/g, " ").split(/\s+/).filter(Boolean).length;
  return { html: out.join("\n"), headings, words };
}

module.exports = { frontMatter, render, inline };
