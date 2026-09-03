import axios from 'axios';

const ML_API_BASE_URL = 'https://sih-2026-23oy.onrender.com/api';

// ML Service for predictions and analysis
export const mlApi = {
  // Get all projects with ML analysis
  getAllProjectsWithAnalysis: async () => {
    try {
      const response = await axios.get(`${ML_API_BASE_URL}/projects`);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching projects with analysis:', error);
      return [];
    }
  },

  // Get detailed analysis for a single project
  getProjectAnalysis: async (projectId: string) => {
    try {
      const response = await axios.get(`${ML_API_BASE_URL}/projects/${projectId}`);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching project analysis:', error);
      return null;
    }
  },

  // Real-time analysis of a project
  analyzeProject: async (projectData: {
    project_id: string;
    name: string;
    budget: number;
    expenditure: number;
    progress: number;
    status: string;
  }) => {
    try {
      console.log('📊 Sending project for ML analysis...', projectData);
      const response = await axios.post(`${ML_API_BASE_URL}/v1/analyze`, projectData);
      console.log('✅ ML Analysis received:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error analyzing project:', error);
      return null;
    }
  },

  // Get dashboard summary with ML insights
  getDashboardSummary: async () => {
    try {
      const response = await axios.get(`${ML_API_BASE_URL}/dashboard/summary`);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching dashboard summary:', error);
      return null;
    }
  },

  // Get priority investigations
  getPriorityInvestigations: async () => {
    try {
      const response = await axios.get(`${ML_API_BASE_URL}/investigations/priority`);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching investigations:', error);
      return [];
    }
  },

  // Get state analytics
  getStateAnalytics: async () => {
    try {
      const response = await axios.get(`${ML_API_BASE_URL}/analytics/states`);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching state analytics:', error);
      return [];
    }
  },

  // Get category analytics
  getCategoryAnalytics: async () => {
    try {
      const response = await axios.get(`${ML_API_BASE_URL}/analytics/categories`);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching category analytics:', error);
      return [];
    }
  },

  // Search projects
  searchProjects: async (query: string) => {
    try {
      const response = await axios.get(`${ML_API_BASE_URL}/search`, {
        params: { q: query }
      });
      return response.data;
    } catch (error) {
      console.error('❌ Error searching projects:', error);
      return [];
    }
  },

  // Get system health
  checkHealth: async () => {
    try {
      const response = await axios.get(`${ML_API_BASE_URL}/health`);
      return response.data;
    } catch (error) {
      console.error('⚠️ ML API health check failed:', error);
      return { status: 'unavailable' };
    }
  }
};
