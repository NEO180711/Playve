/** 애드센스에서 발급한 게시자 ID (index.html 스크립트·메타와 동일). */
export const PUBLISHER_CLIENT_ID = "ca-pub-9076263469821087";

const SCRIPT_SRC = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${PUBLISHER_CLIENT_ID}`;

export function getAdClient(): string {
  const fromEnv = import.meta.env.VITE_AD_CLIENT?.trim();
  return fromEnv || PUBLISHER_CLIENT_ID;
}

let scriptPromise: Promise<void> | null = null;

function findHeadScript(): HTMLScriptElement | null {
  for (const n of document.querySelectorAll('script[src*="adsbygoogle.js"]')) {
    if (n instanceof HTMLScriptElement && n.src.includes(PUBLISHER_CLIENT_ID)) return n;
  }
  return null;
}

/** index.html의 공식 스크립트 로드를 기다립니다. 없을 때만 동일 URL로 한 번 삽입합니다. */
export function loadDisplayAdScript(): Promise<void> {
  if (typeof document === "undefined") return Promise.resolve();

  const existing = findHeadScript();
  if (existing) {
    scriptPromise ??= new Promise((resolve, reject) => {
      if (window.adsbygoogle != null) {
        resolve();
        return;
      }
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("adsbygoogle load failed")), { once: true });
    });
    return scriptPromise;
  }

  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.async = true;
    s.crossOrigin = "anonymous";
    s.src = SCRIPT_SRC;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("adsbygoogle load failed"));
    document.head.appendChild(s);
  });
  return scriptPromise;
}

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

export function pushAdPlacement(): void {
  try {
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  } catch {
    /* ignore */
  }
}
