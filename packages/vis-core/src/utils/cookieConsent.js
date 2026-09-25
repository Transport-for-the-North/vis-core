import Cookies from "js-cookie";

export const ANALYTICS_CONSENT_COOKIE = "analyticsConsent";
export const ANALYTICS_CONSENT_ACCEPTED = "accepted";
export const ANALYTICS_CONSENT_REJECTED = "rejected";

const COOKIE_OPTIONS = {
  expires: 180,
  secure: true,
  sameSite: "Lax",
  path: "/",
};

export const getAnalyticsConsent = () => {
  const value = Cookies.get(ANALYTICS_CONSENT_COOKIE);

  if (value === ANALYTICS_CONSENT_ACCEPTED || value === ANALYTICS_CONSENT_REJECTED) {
    return value;
  }

  return null;
};

export const setAnalyticsConsent = (consentValue) => {
  if (consentValue !== ANALYTICS_CONSENT_ACCEPTED && consentValue !== ANALYTICS_CONSENT_REJECTED) {
    return;
  }

  Cookies.set(ANALYTICS_CONSENT_COOKIE, consentValue, COOKIE_OPTIONS);
};

export const applyClarityConsent = (isGranted) => {
  if (typeof window === "undefined" || typeof window.clarity !== "function") {
    return;
  }

  window.clarity("consentv2", {
    ad_Storage: isGranted ? "granted" : "denied",
    analytics_Storage: isGranted ? "granted" : "denied",
  });
};

export const hasAcceptedAnalytics = () => getAnalyticsConsent() === ANALYTICS_CONSENT_ACCEPTED;

export const trackClarityEvent = (eventName) => {
  if (!hasAcceptedAnalytics()) {
    return;
  }

  if (typeof window === "undefined" || typeof window.clarity !== "function") {
    return;
  }

  window.clarity("event", eventName);
};
