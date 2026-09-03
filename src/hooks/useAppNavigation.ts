/**
 * Custom hook for application-wide navigation
 * Syncs state management with React Router
 */

import { useNavigate, useLocation } from "react-router-dom";
import { getRoutePath } from "../routes/routeConfig";

export interface NavigationState {
  currentView: string;
  previousView: string | null;
}

/**
 * Hook to handle app-wide navigation with URL syncing
 */
export const useAppNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  /**
   * Navigate to a view by route name or custom path
   * @param viewNameOrPath - Either a route name (from ROUTE_CONFIG) or a custom path
   * @param options - Navigation options
   */
  const navigateTo = (
    viewNameOrPath: string,
    options: { replace?: boolean; state?: any } = {}
  ) => {
    // Try to get route path from config first
    let targetPath = getRoutePath(viewNameOrPath);

    // If not found in config, assume it's already a path
    if (targetPath === "/" && viewNameOrPath !== "/" && !viewNameOrPath.startsWith("/")) {
      targetPath = `/${viewNameOrPath}`;
    }

    navigate(targetPath, {
      replace: options.replace ?? false,
      state: options.state,
    });
  };

  /**
   * Get current view name from current pathname
   */
  const getCurrentView = (): string => {
    const pathname = location.pathname;

    // Remove leading slash and convert to route name format
    if (pathname === "/") return "landing";

    // Extract the first segment after /
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length === 0) return "landing";

    // Convert kebab-case to camelCase for route names
    const routeName = segments[0]
      .split("-")
      .reduce((acc, part, idx) => {
        if (idx === 0) return part;
        return acc + part.charAt(0).toUpperCase() + part.slice(1);
      }, "");

    return routeName;
  };

  /**
   * Navigate back
   */
  const goBack = () => {
    navigate(-1);
  };

  /**
   * Navigate to home/landing
   */
  const goHome = () => {
    navigateTo("landing");
  };

  /**
   * Navigate to a specific route with parameters
   */
  const navigateWithParams = (
    routeName: string,
    params: Record<string, string | number>
  ) => {
    let path = getRoutePath(routeName);

    // Replace route parameters
    Object.entries(params).forEach(([key, value]) => {
      path = path.replace(`:${key}`, String(value));
    });

    // Add remaining params as query parameters
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (!path.includes(`:${key}`)) {
        searchParams.append(key, String(value));
      }
    });

    const queryString = searchParams.toString();
    navigate(queryString ? `${path}?${queryString}` : path);
  };

  return {
    navigateTo,
    getCurrentView,
    goBack,
    goHome,
    navigateWithParams,
    currentPath: location.pathname,
    currentSearch: location.search,
  };
};
