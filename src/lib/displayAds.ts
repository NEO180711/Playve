/** 게시자 클라이언트 ID (ca-pub-… 형식). */
export function getAdClient(): string | undefined {
  const c = import.meta.env.VITE_AD_CLIENT?.trim();
  return c || undefined;
}

let scriptPromise: Promise<void> | null = null;

/** 동의 후 한 번만 로드. 자동·수동 광고 단위 공용 스크립트. */
export function loadDisplayAdScript(): Promise<void> {
  const client = getAdClient();
  if (!client) return Promise.resolve();
  if (typeof document === "undefined") return Promise.resolve();
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
