import fs from "fs";
import path from "path";
import { cache } from "react";
import { parseClassicHtml } from "./parse-classic-html";
import type { ClassicMeta, ClassicPageData } from "./types";

const CLASSIC_ROOT = "classic";

function readString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function humanizeFolderName(folder: string): string {
  const lastSegment = folder.split("/").filter(Boolean).pop() ?? folder;
  return lastSegment
    .split(/[-_]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

/** Reject anything that is not a plain relative folder under classic/. */
function assertSafeFolder(folder: string): string {
  const normalized = folder
    .replace(/\\/g, "/")
    .replace(/^\/+|\/+$/g, "")
    .trim();

  if (!normalized) {
    throw new Error(
      `generateClassicPage: invalid folder path "${folder}". Expected a relative folder under classic/, e.g. "my-page".`
    );
  }

  const segments = normalized.split("/");

  if (
    path.isAbsolute(folder) ||
    segments.some((segment) => segment === ".." || segment === "." || /^[a-zA-Z]:$/.test(segment))
  ) {
    throw new Error(
      `generateClassicPage: invalid folder path "${folder}". Path traversal and absolute paths are not allowed.`
    );
  }

  return normalized;
}

/** index.html wins; otherwise a single .html file is accepted. */
function findEntryHtml(dir: string, folder: string): string {
  const htmlFiles = fs
    .readdirSync(dir)
    .filter((file) => file.toLowerCase().endsWith(".html"))
    .sort();

  if (htmlFiles.length === 0) {
    throw new Error(
      `generateClassicPage: no .html file found in classic/${folder}. Add an index.html.`
    );
  }

  const index = htmlFiles.find((file) => file.toLowerCase() === "index.html");
  if (index) {
    return index;
  }

  if (htmlFiles.length > 1) {
    throw new Error(
      `generateClassicPage: multiple .html files in classic/${folder} (${htmlFiles.join(", ")}) and no index.html. Either add an index.html or keep a single .html file.`
    );
  }

  return htmlFiles[0];
}

function readMeta(dir: string, folder: string): ClassicMeta {
  const metaPath = path.join(dir, "meta.json");

  if (!fs.existsSync(metaPath)) {
    return {};
  }

  try {
    return JSON.parse(fs.readFileSync(metaPath, "utf8")) as ClassicMeta;
  } catch (error) {
    throw new Error(
      `generateClassicPage: failed to parse classic/${folder}/meta.json: ${(error as Error).message}`
    );
  }
}

/**
 * Parse and cache a classic page folder. Reads happen at build time like
 * the JSON data in data/, and the route fails loudly when content is
 * missing instead of rendering a silent 404.
 */
export const getClassicPage = cache(
  async (folder: string): Promise<ClassicPageData> => {
    const normalized = assertSafeFolder(folder);

    const dir = path.join(process.cwd(), CLASSIC_ROOT, ...normalized.split("/"));

    if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) {
      throw new Error(
        `generateClassicPage: folder "classic/${normalized}" does not exist.`
      );
    }

    const entryFile = findEntryHtml(dir, normalized);
    const source = fs.readFileSync(path.join(dir, entryFile), "utf8");
    const parsed = parseClassicHtml(source);
    const meta = readMeta(dir, normalized);

    if (process.env.NODE_ENV === "development" && parsed.relativeUrls.length > 0) {
      console.warn(
        `[classic-parser] classic/${normalized} uses relative asset URL(s): ${parsed.relativeUrls.join(", ")}. ` +
          "Assets must be absolute (https://...) or site-rooted (/...) - relative paths are never served and will 404."
      );
    }

    const title =
      readString(meta.title) || parsed.title || humanizeFolderName(normalized);

    return {
      folder: normalized,
      entryFile,
      html: parsed.html,
      title,
      description: readString(meta.description) || parsed.description,
      cover: readString(meta.cover),
      author: readString(meta.author),
      post_date: readString(meta.post_date),
      update_date: readString(meta.update_date),
      // Default noindex; only an explicit `false` opts a page into search.
      noindex: meta.noindex === false ? false : true,
      head: parsed.head,
    };
  }
);
