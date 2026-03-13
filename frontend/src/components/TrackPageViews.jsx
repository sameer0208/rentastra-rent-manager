import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView } from "../utils/analytics";

/**
 * Sends page_path to GA4 on every route change (SPA fix).
 * Must be rendered inside BrowserRouter.
 */
export default function TrackPageViews() {
  const location = useLocation();

  useEffect(() => {
    trackPageView(location.pathname);
  }, [location.pathname]);

  return null;
}
