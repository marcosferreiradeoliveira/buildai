import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { initGa4, trackPageView } from "@/lib/analytics";

/** Envia page_view ao GA4 em cada navegação do React Router (SPA). */
const AnalyticsPageView = () => {
  const location = useLocation();

  useEffect(() => {
    initGa4();
  }, []);

  useEffect(() => {
    trackPageView(`${location.pathname}${location.search}`);
  }, [location.pathname, location.search]);

  return null;
};

export default AnalyticsPageView;
