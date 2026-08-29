import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Sync URL path to currentView state
 * This hook keeps the URL and currentView in sync
 */
export const useURLSync = (currentView: string, setCurrentView: (view: string) => void) => {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname.replace(/^\//, "") || "landing";
    // Only update if path doesn't match current view
    if (path !== currentView && path !== "") {
      setCurrentView(path);
    }
  }, [location.pathname, currentView, setCurrentView]);
};

/**
 * Navigation utility to update both URL and currentView
 */
export const useAppNavigation = () => {
  return {
    navigateTo: (view: string) => {
      // Update URL
      window.history.pushState(null, "", "/" + (view === "landing" ? "" : view));
      // Trigger popstate to sync state
      window.dispatchEvent(new PopStateEvent("popstate"));
    },
  };
};
