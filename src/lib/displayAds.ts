/** 사이트 기본 게시자 ID. VITE_AD_CLIENT가 있으면 그 값을 우선합니다. */
const DEFAULT_AD_CLIENT = "ca-pub-9076263469821087";

export function getAdClient(): string {
  const c = import.meta.env.VITE_AD_CLIENT?.trim();
  return c || DEFAULT_AD_CLIENT;
}

let scriptPromise: Promise<void> | null = null;

function findAdsbygoogleScript(): HTMLScriptElement | null {
  const nodes = document.querySelectorAll('script[src*="adsbygoogle.js"]');
  for (const n of nodes) {
    if (n instanceof HTMLScriptElement) return n;
  }
  return null;
}

/** index.html 정적 스크립트 또는 동의 후 주입. 중복 삽입하지 않습니다. */
export function loadDisplayAdScript(): Promise<void> {
  if (typeof document === "undefined") return Promise.resolve();
  const client = getAdClient();

  const existing = findAdsbygoogleScript();
  if (existing) {
    scriptPromise ??= new Promise((resolve, reject) => {
      if (typeof window !== "undefined" && window.adsbygoogle != null) {
        resolve();
        return;
      }
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Display ad script failed")), { once: true });
    });
    return scriptPromise;
  }

  if (document.querySelector('script[data-playve-display-ad="1"]')) {
    return scriptPromise ?? Promise.resolve();
  }

  scriptPromise = new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.async = true;
    s.crossOrigin = "anonymous";
    s.dataset.playveDisplayAd = "1";
    s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(client)}`;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Display ad script failed"));
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
