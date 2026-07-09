declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/** Mesmo ID do snippet em index.html; env opcional para override. */
export const GA4_MEASUREMENT_ID =
  import.meta.env.VITE_GA_MEASUREMENT_ID?.trim() || "G-1MHT8QP7FC";

export const getGa4MeasurementId = (): string => GA4_MEASUREMENT_ID;

export const isGa4Enabled = (): boolean => Boolean(GA4_MEASUREMENT_ID);

const shouldTrackPath = (path: string): boolean => !path.startsWith("/admin");

/** Envia page_view — gtag já carregado no <head> (index.html). */
export const trackPageView = (path: string): void => {
  if (!window.gtag || !shouldTrackPath(path)) return;

  window.gtag("config", GA4_MEASUREMENT_ID, {
    page_path: path,
    page_location: `${window.location.origin}${path}`,
    page_title: document.title,
  });
};

export const trackEvent = (
  eventName: string,
  params?: Record<string, string | number | boolean>,
): void => {
  if (!window.gtag) return;
  window.gtag("event", eventName, params);
};
