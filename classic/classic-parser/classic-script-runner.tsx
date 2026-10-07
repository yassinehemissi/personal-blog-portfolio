"use client";

import { useEffect } from "react";
import type { ClassicScript } from "./types";

interface ClassicScriptRunnerProps {
  scripts: ClassicScript[];
}

/**
 * Injects a classic page's scripts into the live document.
 *
 * Why a client runner instead of raw <script> tags in the HTML?
 * - Scripts inside a dangerouslySetInnerHTML fragment never execute
 *   (browsers do not run scripts inserted via innerHTML).
 * - Raw tags rendered in the RSC payload execute on a full page load,
 *   but are NOT reliably executed on client-side (soft) navigation.
 * Injecting via document.createElement works identically in both cases.
 *
 * Injection is deferred by a macrotask so React strict-mode's double
 * effect invocation cancels the first run before anything executes.
 * Unmounting (navigating away) removes the injected tags; navigating
 * back re-runs them against the freshly rendered fragment, which is
 * what classic pages expect from a full document lifecycle.
 */
export function ClassicScriptRunner({ scripts }: ClassicScriptRunnerProps) {
  useEffect(() => {
    if (scripts.length === 0) {
      return;
    }

    let cancelled = false;
    const added: HTMLScriptElement[] = [];

    const inject = (script: ClassicScript) =>
      new Promise<void>((resolve) => {
        if (cancelled) {
          resolve();
          return;
        }

        const el = document.createElement("script");

        if (script.type) {
          el.type = script.type;
        }

        if (script.src) {
          el.src = script.src;
          // Dynamically inserted scripts are async by default, which
          // would scramble classic pages that rely on script order.
          // Forcing async=false preserves insertion order unless the
          // original tag opted out with its own async attribute.
          el.async = script.async === true;
          if (script.defer) {
            el.defer = true;
          }
          el.addEventListener("load", () => resolve(), { once: true });
          el.addEventListener("error", () => resolve(), { once: true });
          document.head.appendChild(el);
          added.push(el);
          if (script.async === true) {
            // Fire-and-forget, matching the original semantics.
            resolve();
          }
          return;
        }

        // Inline scripts execute synchronously on insertion.
        el.text = script.code ?? "";
        document.head.appendChild(el);
        added.push(el);
        resolve();
      });

    const timer = setTimeout(() => {
      void (async () => {
        for (const script of scripts) {
          await inject(script);
        }
      })();
    }, 0);

    return () => {
      cancelled = true;
      clearTimeout(timer);
      for (const el of added) {
        el.remove();
      }
    };
  }, [scripts]);

  return null;
}
