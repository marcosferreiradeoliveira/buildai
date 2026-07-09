declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID?.trim();

export const getGa4MeasurementId = (): string | undefined => MEASUREMENT_ID;

export const isGa4Enabled = (): boolean => Boolean(MEASUREMENT_ID);

const shouldTrackPath = (path: string): boolean => !path.startsWith("/admin");

let initialized = false;

export const initGa4 = (): void => {
  if (!MEASUREMENT_ID || typeof window === "undefined" || initialized) return;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer ?? [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer!.push(args);
  };

  window.gtag("js", new Date());
  window.gtag("config", MEASUREMENT_ID, { send_page_view: false });

  initialized = true;
};

export const trackPageView = (path: string): void => {
  if (!MEASUREMENT_ID || !window.gtag || !shouldTrackPath(path)) return;

  window.gtag("config", MEASUREMENT_ID, {
    page_path: path,
    page_location: `${window.location.origin}${path}`,
    page_title: document.title,
  });
};

export const trackEvent = (
  eventName: string,
  params?: Record<string, string | number | boolean>,
): void => {
  if (!MEASUREMENT_ID || !window.gtag) return;
  window.gtag("event", eventName, params);
};
