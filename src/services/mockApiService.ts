/**
 * Mock API Service
 * 
 * When VITE_USE_MOCK_DATA=true, all API calls are intercepted and return mock data
 * This eliminates the need to run the backend server
 * 
 * Benefits:
 * - No backend required
 * - Fast development
 * - Work offline
 * - UI-focused testing
 */

import {
  WorkRecord,
  NearDuplicatePair,
  RiskAlert,
  DistrictSummary,
  StateSummary,
} from "../types";

// Simulate network delay (optional, remove for instant responses)
const MOCK_DELAY_MS = 200;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// ==================== MOCK API ENDPOINTS ====================

export const mockApi = {
  // ========== AUTHENTICATION ==========
  async login(email: string, password: string) {
    await delay(MOCK_DELAY_MS);
    
    // Mock login - accepts any credentials
    console.log(`[MOCK] Login: ${email}`);
    
    return {
      success: true,
      data: {
        user: {
          id: "user_123",
          email: email,
          name: email.split("@")[0],
          role: "admin",
          permissions: ["read", "write", "delete", "admin"],
        },
        token: "mock_jwt_token_" + Date.now(),
        expiresIn: 86400,
      },
    };
  },

  async logout() {
    await delay(100);
    console.log("[MOCK] Logout");
    return { success: true };
  },

  async getProfile() {
    await delay(MOCK_DELAY_MS);
    console.log("[MOCK] Get profile");
    return {
      success: true,
      data: {
        id: "user_123",
        email: "user@example.com",
        name: "Demo User",
        role: "admin",
        permissions: ["read", "write", "delete", "admin"],
      },
    };
  },

  // ========== PROJECTS ==========
  async getProjects(page = 1, limit = 10) {
    await delay(MOCK_DELAY_MS);
    console.log(`[MOCK] Get projects - Page ${page}, Limit ${limit}`);
    
    const projects = mockData.workRecords || [];
    const start = (page - 1) * limit;
    const end = start + limit;
    
    return {
      success: true,
      data: {
        projects: projects.slice(start, end),
        total: projects.length,
        page,
        limit,
        totalPages: Math.ceil(projects.length / limit),
      },
    };
  },

  async getProjectById(id: string) {
    await delay(MOCK_DELAY_MS);
    console.log(`[MOCK] Get project: ${id}`);
    
    const project = mockData.workRecords?.find(p => p.id === id);
    return {
      success: true,
      data: project || null,
    };
  },

  // ========== DASHBOARD ==========
  async getDashboardMetrics() {
    await delay(MOCK_DELAY_MS);
    console.log("[MOCK] Get dashboard metrics");
    
    return {
      success: true,
      data: {
        totalProjects: mockData.workRecords?.length || 0,
        totalRiskAlerts: mockData.riskAlerts?.length || 0,
        nearDuplicates: mockData.nearDuplicatePairs?.length || 0,
        complianceScore: 85,
        dataFreshness: new Date().toISOString(),
        systemHealth: {
          status: "healthy",
          uptime: "99.9%",
          lastSync: new Date().toISOString(),
        },
      },
    };
  },

  // ========== ALERTS ==========
  async getAlerts(type?: string) {
    await delay(MOCK_DELAY_MS);
    console.log(`[MOCK] Get alerts${type ? ` (${type})` : ""}`);
    
    let alerts = mockData.riskAlerts || [];
    if (type) {
      alerts = alerts.filter(a => a.type === type);
    }
    
    return {
      success: true,
      data: alerts,
    };
  },

  async getAlertById(id: string) {
    await delay(MOCK_DELAY_MS);
    console.log(`[MOCK] Get alert: ${id}`);
    
    const alert = mockData.riskAlerts?.find(a => a.id === id);
    return {
      success: true,
      data: alert || null,
    };
  },

  // ========== NEAR DUPLICATES ==========
  async getNearDuplicates(page = 1, limit = 10) {
    await delay(MOCK_DELAY_MS);
    console.log(`[MOCK] Get near duplicates - Page ${page}, Limit ${limit}`);
    
    const duplicates = mockData.nearDuplicatePairs || [];
    const start = (page - 1) * limit;
    const end = start + limit;
    
    return {
      success: true,
      data: {
        duplicates: duplicates.slice(start, end),
        total: duplicates.length,
        page,
        limit,
        totalPages: Math.ceil(duplicates.length / limit),
      },
    };
  },

  // ========== ANALYSIS ==========
  async analyzeProjects(projectIds: string[]) {
    await delay(MOCK_DELAY_MS * 2); // Longer delay for analysis
    console.log(`[MOCK] Analyze projects: ${projectIds.length} items`);
    
    return {
      success: true,
      data: {
        analyzed: projectIds.length,
        issues: Math.floor(Math.random() * 10),
        recommendations: ["Review project scope", "Update timeline", "Allocate resources"],
      },
    };
  },

  // ========== STATISTICS ==========
  async getDistrictStats() {
    await delay(MOCK_DELAY_MS);
    console.log("[MOCK] Get district statistics");
    
    return {
      success: true,
      data: mockData.districtSummaries || [],
    };
  },

  async getStateStats() {
    await delay(MOCK_DELAY_MS);
    console.log("[MOCK] Get state statistics");
    
    return {
      success: true,
      data: mockData.stateSummaries || [],
    };
  },

  // ========== SYSTEM ==========
  async getSystemHealth() {
    await delay(100);
    console.log("[MOCK] Get system health");
    
    return {
      success: true,
      data: {
        status: "healthy",
        uptime: "99.9%",
        lastCheck: new Date().toISOString(),
      },
    };
  },

  // ========== FALLBACK - GENERIC ENDPOINT ==========
  async call(endpoint: string, method = "GET", body?: any) {
    await delay(MOCK_DELAY_MS);
    console.log(`[MOCK] ${method} ${endpoint}`);
    
    // Return generic mock response
    return {
      success: true,
      data: {
        endpoint,
        method,
        message: "Mock API endpoint",
      },
    };
  },
};

export default mockApi;
