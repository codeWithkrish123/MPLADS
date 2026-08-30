import React from "react";
import { Routes, Route } from "react-router-dom";
import App from "./App";

/**
 * AppRoutes - Wrapper component that sets up all routing paths
 * Routes the app to different URLs while using the same App component
 */
export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/landing" element={<App />} />
      <Route path="/signin" element={<App />} />
      <Route path="/login" element={<App />} />
      <Route path="/contact" element={<App />} />
      <Route path="/overview" element={<App />} />
      <Route path="/dashboard" element={<App />} />
      <Route path="/works" element={<App />} />
      <Route path="/works/:projectId" element={<App />} />
      <Route path="/simulator" element={<App />} />
      <Route path="/alerts" element={<App />} />
      <Route path="/map" element={<App />} />
      <Route path="/costAnomaly" element={<App />} />
      <Route path="/duplicate" element={<App />} />
      <Route path="/expenditure" element={<App />} />
      <Route path="/delay" element={<App />} />
      <Route path="/compliance" element={<App />} />
      <Route path="/policy" element={<App />} />
      <Route path="/auditLogs" element={<App />} />
      <Route path="/aiAssistant" element={<App />} />
      <Route path="/mpDashboard" element={<App />} />
      <Route path="/stateNodal" element={<App />} />
      <Route path="/agencies" element={<App />} />
      <Route path="/stateIntel" element={<App />} />
      <Route path="/districtIntel" element={<App />} />
      <Route path="/customDataset" element={<App />} />
      <Route path="/roleSelector" element={<App />} />
      {/* Catch-all: redirect to landing */}
      <Route path="*" element={<App />} />
    </Routes>
  );
};

export default AppRoutes;
