import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import App from "./App";

/**
 * AppRoutes - Wrapper component that sets up all routing paths with proper URL structure
 * 
 * Route Hierarchy:
 * - Public routes (landing, login, contact)
 * - Protected routes (all dashboard and intelligence views)
 * 
 * Each route maps to a URL that displays in the browser address bar
 */
export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<App />} />
      <Route path="/login" element={<App />} />
      <Route path="/contact" element={<App />} />
      <Route path="/role-selector" element={<App />} />

      {/* Main Dashboard Routes */}
      <Route path="/overview" element={<App />} />
      <Route path="/works" element={<App />} />
      <Route path="/custom-dataset" element={<App />} />
      <Route path="/ai-assistant" element={<App />} />

      {/* Primary Intelligence Routes */}
      <Route path="/alerts" element={<App />} />
      <Route path="/map" element={<App />} />

      {/* AI Anomaly Detection Routes */}
      <Route path="/cost-anomaly" element={<App />} />
      <Route path="/duplicate" element={<App />} />
      <Route path="/expenditure" element={<App />} />
      <Route path="/delay" element={<App />} />

      {/* Jurisdiction & Workspace Routes */}
      <Route path="/state-intelligence" element={<App />} />
      <Route path="/district-intelligence" element={<App />} />
      <Route path="/mp-dashboard" element={<App />} />
      <Route path="/state-nodal" element={<App />} />
      <Route path="/agencies" element={<App />} />

      {/* Governance & Audit Routes */}
      <Route path="/compliance" element={<App />} />
      <Route path="/policy" element={<App />} />
      <Route path="/audit-logs" element={<App />} />

      {/* Legacy route redirects for backward compatibility */}
      <Route path="/landing" element={<Navigate to="/" replace />} />
      <Route path="/signin" element={<Navigate to="/login" replace />} />
      <Route path="/costAnomaly" element={<Navigate to="/cost-anomaly" replace />} />
      <Route path="/districtIntel" element={<Navigate to="/district-intelligence" replace />} />
      <Route path="/stateIntel" element={<Navigate to="/state-intelligence" replace />} />
      <Route path="/customDataset" element={<Navigate to="/custom-dataset" replace />} />
      <Route path="/aiAssistant" element={<Navigate to="/ai-assistant" replace />} />
      <Route path="/mpDashboard" element={<Navigate to="/mp-dashboard" replace />} />
      <Route path="/stateNodal" element={<Navigate to="/state-nodal" replace />} />
      <Route path="/roleSelector" element={<Navigate to="/role-selector" replace />} />
      <Route path="/auditLogs" element={<Navigate to="/audit-logs" replace />} />

      {/* Catch-all: redirect to landing */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
