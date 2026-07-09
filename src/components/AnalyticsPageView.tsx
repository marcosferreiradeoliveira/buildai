import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView } from "@/lib/analytics";

/** Envia page_view ao GA4 nas navegações SPA (a primeira carga já vai pelo gtag no index.html). */
const AnalyticsPageView = () => {
  const location = useLocation();
  const isFirstRender = useRef(true);

  useEffect(() => {
    const path = `${location.pathname}${location.search}`;

    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    trackPageView(path);
  }, [location.pathname, location.search]);

  return null;
};

export default AnalyticsPageView;
