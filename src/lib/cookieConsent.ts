export const CONSENT_EVENT = "plaently-consent-change";
export const CONSENT_OPEN_EVENT = "plaently-consent-open";

declare global {
  interface Window {
    katla?: { open?: () => void };
  }
}

export const openCookieSettings = () => {
  window.katla?.open?.();
  window.dispatchEvent(new Event(CONSENT_OPEN_EVENT));
};
