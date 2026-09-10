/**
 * API Gateway - Smart Router
 * 
 * Routes API calls to either:
 * - Real Backend API (when VITE_USE_MOCK_DATA=false)
 * - Mock API Service (when VITE_USE_MOCK_DATA=true)
 * 
 * Usage:
 * import { apiGateway } from './services/apiGateway'
 * 
 * const projects = await apiGateway.getProjects()
 */

import config from "../config/featureFlags";
import { apiCall, authApi } from "./api";
import { mockApi } from "./mockApiService";

/**
 * Smart wrapper that calls either real or mock API
 */
export const apiGateway = {
  // ========== AUTHENTICATION ==========
  async login(email: string, password: string, role: string = "ministry") {
    if (config.useMockData) {
      return mockApi.login(email, password);
    }
    return authApi.login(email, password, role);
  },

  async logout() {
    if (config.useMockData) {
      return mockApi.logout();
    }
    return apiCall("/auth/logout", { method: "POST" });
  },

  async getProfile() {
    if (config.useMockData) {
      return mockApi.getProfile();
    }
    return apiCall("/auth/profile", { method: "GET" });
  },

  // ========== PROJECTS ==========
  async getProjects(page = 1, limit = 10) {
    if (config.useMockData) {
      return mockApi.getProjects(page, limit);
    }
    return apiCall(`/projects?page=${page}&limit=${limit}`, { method: "GET" });
  },

  async getProjectById(id: string) {
    if (config.useMockData) {
      return mockApi.getProjectById(id);
    }
    return apiCall(`/projects/${id}`, { method: "GET" });
  },

  // ========== DASHBOARD ==========
  async getDashboardMetrics() {
    if (config.useMockData) {
      return mockApi.getDashboardMetrics();
    }
    return apiCall("/dashboard/metrics", { method: "GET" });
  },

  // ========== ALERTS ==========
  async getAlerts(type?: string) {
    if (config.useMockData) {
      return mockApi.getAlerts(type);
    }
    const url = type ? `/alerts?type=${type}` : "/alerts";
    return apiCall(url, { method: "GET" });
  },

  async getAlertById(id: string) {
    if (config.useMockData) {
      return mockApi.getAlertById(id);
    }
    return apiCall(`/alerts/${id}`, { method: "GET" });
  },

  // ========== NEAR DUPLICATES ==========
  async getNearDuplicates(page = 1, limit = 10) {
    if (config.useMockData) {
      return mockApi.getNearDuplicates(page, limit);
    }
    return apiCall(`/duplicates?page=${page}&limit=${limit}`, { method: "GET" });
  },

  // ========== ANALYSIS ==========
  async analyzeProjects(projectIds: string[]) {
    if (config.useMockData) {
      return mockApi.analyzeProjects(projectIds);
    }
    return apiCall("/analysis/projects", {
      method: "POST",
      body: JSON.stringify({ projectIds }),
    });
  },

  // ========== STATISTICS ==========
  async getDistrictStats() {
    if (config.useMockData) {
      return mockApi.getDistrictStats();
    }
    return apiCall("/stats/districts", { method: "GET" });
  },

  async getStateStats() {
    if (config.useMockData) {
      return mockApi.getStateStats();
    }
    return apiCall("/stats/states", { method: "GET" });
  },

  // ========== SYSTEM ==========
  async getSystemHealth() {
    if (config.useMockData) {
      return mockApi.getSystemHealth();
    }
    return apiCall("/system/health", { method: "GET" });
  },
};

export default apiGateway;
