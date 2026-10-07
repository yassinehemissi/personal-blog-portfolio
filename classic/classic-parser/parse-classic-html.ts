import { parse } from "node-html-parser";
import type {
  ClassicHeadAssets,
  ClassicScript,
  ClassicStylesheet,
} from "./types";

export interface ParsedClassicHtml {
  /** Body fragment with scripts (and stylesheet links) removed. */
  html: string;
  /** Decoded text of `<title>`, if present in the head. */
  title?: string;
  /** Content of `<meta name="description">`, if present in the head. */
  description?: string;
  head: ClassicHeadAssets;
  /**
   * href/src values that are neither absolute (https://...) nor
   * site-rooted (/...). They would 404 as-is; the reader warns in dev.
   */
  relativeUrls: string[];
}

/**
 * A URL is usable when empty (dynamic hrefs), anchored (#), or absolute
 * in the broad sense: protocol, protocol-relative, site-rooted, or a
 * data/blob/mailto/tel URI. Anything else (e.g. "img/cat.jpg") is
 * relative to a folder that is never served, so it will 404.
 */
const USABLE_URL_PATTERN = /^(https?:|\/\/|\/|#|mailto:|tel:|data:|blob:)/i;

function isUsableUrl(value: string): boolean {
  return USABLE_URL_PATTERN.test(value.trim());
}

/* ------------------------------------------------------------------ *
 * Head extraction - tree based. node-html-parser parses <head>
 * reliably (title, meta, link, style, script); only the body region
 * of a full document comes out of its tree mangled (flattened
 * children, unreliable detach), so the body is handled as a string.
 * ------------------------------------------------------------------ */

function extractHead(
  source: string,
  assets: ClassicHeadAssets
): { title?: string; description?: string } {
  const head = parse(source).querySelector("head");

  if (!head) {
    return {};
  }

  let title: string | undefined;
  let description: string | undefined;

  const titleText = head.querySelector("title")?.text?.trim();
  if (titleText) {
    title = titleText;
  }

  for (const meta of head.querySelectorAll("meta")) {
    const attrs = meta.attributes || {};
    const name = (attrs.name || "").toLowerCase();
    const content = attrs.content?.trim();
    if (name === "description" && content) {
      description = content;
    }
  }

  for (const link of head.querySelectorAll("link")) {
    const attrs = link.attributes || {};
    const rel = (attrs.rel || "").toLowerCase();

    if (!rel.split(/\s+/).includes("stylesheet")) {
      continue;
    }

    const href = attrs.href?.trim();
    if (!href) {
      continue;
    }

    const sheet: ClassicStylesheet = { href };
    const media = attrs.media?.trim();
    if (media) {
      sheet.media = media;
    }
    assets.stylesheets.push(sheet);
  }

  for (const style of head.querySelectorAll("style")) {
    const css = style.rawText;
    if (css?.trim()) {
      assets.styles.push(css);
    }
  }

  for (const script of head.querySelectorAll("script")) {
    const attrs = script.attributes || {};
    const classicScript: ClassicScript = {};

    const src = attrs.src?.trim();
    if (src) {
      classicScript.src = src;
    }

    const type = attrs.type?.trim();
    if (type) {
      classicScript.type = type;
    }

    // `el.attributes` records presence with an empty value.
    if (attrs.async !== undefined) {
      classicScript.async = true;
    }
    if (attrs.defer !== undefined) {
      classicScript.defer = true;
    }

    if (!src) {
      // `rawText` keeps script contents byte-for-byte (no entity decoding).
      classicScript.code = script.rawText || "";
    }

    if (classicScript.src || classicScript.code?.trim()) {
      assets.scripts.push(classicScript);
    }
  }

  return { title, description };
}

/* ------------------------------------------------------------------ *
 * Content extraction - string based. Slicing the raw source keeps the
 * body byte-identical and sidesteps tree quirks entirely. Script
 * blocks cannot contain "</script" per the HTML spec, so the non-greedy
 * block regex below is safe for real pages.
 * ------------------------------------------------------------------ */

const BODY_OPEN_PATTERN = /<body\b[^>]*>/i;
const BODY_CLOSE_TOKEN = "</body";
const HEAD_REGION_PATTERN = /<head\b[^>]*>[\s\S]*?<\/head\s*>/i;
const HTML_OR_BODY_WRAPPER_PATTERN = /<\/?(?:html|body)\b[^>]*>/gi;
const LEADING_DOCTYPE_PATTERN = /^\s*<!DOCTYPE[^>]*>\s*/i;
const SCRIPT_BLOCK_PATTERN = /<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi;
const LINK_TAG_PATTERN = /<link\b[^>]*>/gi;
const URL_ATTR_PATTERN =
  /(?:^|[\s"'])(?:href|src)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/gi;

function sliceBodyFragment(source: string): string {
  const open = BODY_OPEN_PATTERN.exec(source);

  if (open) {
    const start = open.index + open[0].length;
    const closeIndex = source.toLowerCase().lastIndexOf(BODY_CLOSE_TOKEN);
    return closeIndex > start
      ? source.slice(start, closeIndex)
      : source.slice(start);
  }

  // No explicit <body> tag: a fragment, or a malformed document. Use the
  // whole source minus document scaffolding so head markup cannot leak
  // into the fragment (it would also double-collect head scripts).
  let fragment = source.replace(LEADING_DOCTYPE_PATTERN, "");
  fragment = fragment.replace(HEAD_REGION_PATTERN, "");
  fragment = fragment.replace(HTML_OR_BODY_WRAPPER_PATTERN, "");
  return fragment;
}

function extractAttrValue(attrs: string, name: string): string | undefined {
  const match = attrs.match(
    new RegExp(
      `(?:^|\\s)${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`,
      "i"
    )
  );

  if (!match) {
    return undefined;
  }

  const value = match[1] ?? match[2] ?? match[3] ?? "";
  return value.trim() || undefined;
}

function hasAttrFlag(attrs: string, name: string): boolean {
  // "async" / "defer" as bare flags; must not match "data-async".
  return new RegExp(`(?:^|\\s)${name}(?=[\\s=]|$)`, "i").test(attrs);
}

function extractScriptsAndStylesheets(
  fragment: string,
  assets: ClassicHeadAssets
): string {
  let html = fragment.replace(
    SCRIPT_BLOCK_PATTERN,
    (_match, attrSource: string, code: string) => {
      const attrs = attrSource || "";
      const script: ClassicScript = {};

      const src = extractAttrValue(attrs, "src");
      if (src) {
        script.src = src;
      }

      const type = extractAttrValue(attrs, "type");
      if (type) {
        script.type = type;
      }

      if (hasAttrFlag(attrs, "async")) {
        script.async = true;
      }
      if (hasAttrFlag(attrs, "defer")) {
        script.defer = true;
      }

      if (!script.src) {
        script.code = code ?? "";
      }

      if (script.src || script.code?.trim()) {
        assets.scripts.push(script);
      }

      // Scripts must not stay in the fragment: innerHTML-injected
      // scripts never execute, and the runner re-injects each one.
      return "";
    }
  );

  html = html.replace(LINK_TAG_PATTERN, (tag) => {
    const rel = extractAttrValue(tag, "rel")?.toLowerCase();
    const href = extractAttrValue(tag, "href");

    if (!rel || !rel.split(/\s+/).includes("stylesheet") || !href) {
      return tag;
    }

    const sheet: ClassicStylesheet = { href };
    const media = extractAttrValue(tag, "media");
    if (media) {
      sheet.media = media;
    }
    assets.stylesheets.push(sheet);
    return "";
  });

  return html;
}

function collectRelativeUrls(
  fragment: string,
  assets: ClassicHeadAssets
): string[] {
  const urls: string[] = [];

  const push = (value: string | undefined) => {
    if (!value) {
      return;
    }

    const url = value.trim();
    if (url && !isUsableUrl(url) && !urls.includes(url)) {
      urls.push(url);
    }
  };

  for (const match of fragment.matchAll(URL_ATTR_PATTERN)) {
    push(match[1] ?? match[2] ?? match[3]);
  }

  for (const sheet of assets.stylesheets) {
    push(sheet.href);
  }

  for (const script of assets.scripts) {
    push(script.src);
  }

  return urls;
}

export function parseClassicHtml(source: string): ParsedClassicHtml {
  const assets: ClassicHeadAssets = { stylesheets: [], styles: [], scripts: [] };
  const { title, description } = extractHead(source, assets);

  let fragment = sliceBodyFragment(source);
  fragment = extractScriptsAndStylesheets(fragment, assets);

  const relativeUrls = collectRelativeUrls(fragment, assets);

  return { html: fragment, title, description, head: assets, relativeUrls };
}
