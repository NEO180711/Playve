import type { InjectionKey, Ref } from "vue";

export type AdConsent = "granted" | "denied";

export const CONSENT_STORAGE_KEY = "playve_ads_consent_v1";

export const AD_CONSENT_KEY: InjectionKey<Ref<AdConsent | null>> = Symbol("playveAdConsent");

export function readAdConsent(): AdConsent | null {
  try {
    const v = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (v === "granted" || v === "denied") return v;
  } catch {
    /* ignore */
  }
  return null;
}

export function writeAdConsent(v: AdConsent): void {
  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, v);
  } catch {
    /* ignore */
  }
}
