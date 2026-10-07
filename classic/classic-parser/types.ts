export interface ClassicStylesheet {
  /** Absolute or site-rooted URL (https://... or /...). */
  href: string;
  media?: string;
}

export interface ClassicScript {
  /** External script source. */
  src?: string;
  /** Inline script code. */
  code?: string;
  type?: string;
  async?: boolean;
  defer?: boolean;
}

export interface ClassicHeadAssets {
  /**
   * `<link rel="stylesheet">` tags collected from the head and body.
   * Re-rendered as real JSX tags so React manages loading and removal.
   */
  stylesheets: ClassicStylesheet[];
  /** Raw contents of `<style>` blocks collected from the head. */
  styles: string[];
  /**
   * Scripts collected from the head and body, in document order.
   * They are re-injected after the body fragment exists (defer-like):
   * classic pages typically guard head scripts with DOMContentLoaded or
   * place scripts at the end of the body, so both patterns keep working.
   */
  scripts: ClassicScript[];
}

/** Optional sidecar metadata. Values here override what the HTML declares. */
export interface ClassicMeta {
  title?: string;
  description?: string;
  cover?: string;
  author?: string;
  post_date?: string;
  update_date?: string;
  /**
   * Default `true`: classic pages are noindex (excluded from search,
   * like notes) unless explicitly set to `false` per page.
   */
  noindex?: boolean;
}

export interface ClassicPageData {
  /** Folder path relative to `classic/`, normalized to forward slashes. */
  folder: string;
  /** HTML file that was used as the entry point. */
  entryFile: string;
  /** Body fragment, ready to render via dangerouslySetInnerHTML. */
  html: string;
  /** Resolved title: meta.json -> HTML <title> -> humanized folder name. */
  title: string;
  /** Resolved description: meta.json -> HTML meta description. */
  description?: string;
  cover?: string;
  author?: string;
  post_date?: string;
  update_date?: string;
  noindex: boolean;
  head: ClassicHeadAssets;
}

export interface GenerateClassicPageOptions {
  /**
   * Canonical path of the mounted route, e.g. "/tsp-report".
   * The utility cannot know where you mount a page, so canonical URLs
   * are only emitted when you pass one.
   */
  canonical?: string;
}
