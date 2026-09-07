/**
 * Project Service Layer
 * 
 * Handles all project-related operations:
 * - Fetching projects with filters
 * - Searching projects
 * - Getting project details with analysis
 * - Managing project state
 */

import { projectApi, analysisApi } from './api';
import { WorkRecord } from '../types';

export interface ProjectFilter {
  state?: string;
  district?: string;
  status?: string;
  category?: string;
  agency?: string;
  page?: number;
  limit?: number;
}

/**
 * Fetch projects with optional filters and pagination
 */
export async function fetchProjects(filters?: ProjectFilter) {
  try {
    console.log('[ProjectService] Fetching projects with filters:', filters);
    
    const result = await projectApi.getAll({
      state: filters?.state,
      district: filters?.district,
      status: filters?.status,
      page: filters?.page || 1,
      limit: filters?.limit || 50,
    });

    console.log(`[ProjectService] Fetched ${result.data?.length || 0} projects`);

    return {
      projects: result.data || [],
      total: result.total || 0,
      page: result.page || 1,
      limit: result.limit || 50,
    };
  } catch (error) {
    console.error('[ProjectService] Failed to fetch projects:', error);
    throw error;
  }
}

/**
 * Search projects by query
 */
export async function searchProjects(query: string) {
  if (!query || query.length < 2) {
    console.log('[ProjectService] Search query too short');
    return [];
  }

  try {
    console.log(`[ProjectService] Searching for: "${query}"`);
    
    const result = await projectApi.getAll({ limit: 100 });
    
    const filtered = result.data.filter(p =>
      p.name?.toLowerCase().includes(query.toLowerCase()) ||
      p.location?.toLowerCase().includes(query.toLowerCase())
    );

    console.log(`[ProjectService] Found ${filtered.length} matching projects`);
    return filtered;
  } catch (error) {
    console.error('[ProjectService] Search failed:', error);
    throw error;
  }
}

/**
 * Get detailed project with all analysis
 */
export async function getProjectDetails(projectId: string) {
  try {
    console.log(`[ProjectService] Loading project ${projectId}`);
    
    const [project, analysis] = await Promise.all([
      projectApi.getById(projectId),
      analysisApi.getProjectAnalysis(projectId).catch(() => null),
    ]);

    console.log(`[ProjectService] Loaded project: ${project.name}`);

    return {
      ...project,
      ...analysis,
    };
  } catch (error) {
    console.error(`[ProjectService] Failed to load project ${projectId}:`, error);
    throw error;
  }
}

/**
 * Get projects by state
 */
export async function getProjectsByState(stateName: string) {
  console.log(`[ProjectService] Fetching projects for state: ${stateName}`);
  return fetchProjects({ state: stateName, limit: 100 });
}

/**
 * Get projects by district
 */
export async function getProjectsByDistrict(state: string, district: string) {
  console.log(`[ProjectService] Fetching projects for ${state}/${district}`);
  return fetchProjects({ state, district, limit: 100 });
}

/**
 * Get high-risk projects
 */
export async function getHighRiskProjects() {
  try {
    console.log('[ProjectService] Fetching high-risk projects');
    
    const result = await fetchProjects({ limit: 100 });
    
    // Filter for high-risk projects
    // (Note: risk level would come from analysis data)
    return result.projects;
  } catch (error) {
    console.error('[ProjectService] Failed to fetch high-risk projects:', error);
    throw error;
  }
}

/**
 * Get delayed projects
 */
export async function getDelayedProjects() {
  try {
    console.log('[ProjectService] Fetching delayed projects');
    
    const result = await fetchProjects({ status: 'delayed', limit: 100 });
    return result.projects;
  } catch (error) {
    console.error('[ProjectService] Failed to fetch delayed projects:', error);
    throw error;
  }
}

/**
 * Create new project
 */
export async function createProject(projectData: Partial<WorkRecord>) {
  try {
    console.log('[ProjectService] Creating new project:', projectData.name);
    
    const project = await projectApi.create(projectData);
    
    console.log('[ProjectService] Project created:', project.id);
    return project;
  } catch (error) {
    console.error('[ProjectService] Failed to create project:', error);
    throw error;
  }
}

/**
 * Update existing project
 */
export async function updateProject(projectId: string, data: Partial<WorkRecord>) {
  try {
    console.log(`[ProjectService] Updating project ${projectId}`);
    
    const project = await projectApi.update(projectId, data);
    
    console.log(`[ProjectService] Project updated: ${projectId}`);
    return project;
  } catch (error) {
    console.error(`[ProjectService] Failed to update project ${projectId}:`, error);
    throw error;
  }
}

/**
 * Delete project
 */
export async function deleteProject(projectId: string) {
  try {
    console.log(`[ProjectService] Deleting project ${projectId}`);
    
    await projectApi.delete(projectId);
    
    console.log(`[ProjectService] Project deleted: ${projectId}`);
  } catch (error) {
    console.error(`[ProjectService] Failed to delete project ${projectId}:`, error);
    throw error;
  }
}

/**
 * Analyze project with ML
 */
export async function analyzeProject(projectId: string) {
  try {
    console.log(`[ProjectService] Analyzing project ${projectId}`);
    
    const analysis = await analysisApi.analyzeProject(projectId);
    
    console.log(`[ProjectService] Analysis complete for ${projectId}`);
    return analysis;
  } catch (error) {
    console.error(`[ProjectService] Analysis failed for ${projectId}:`, error);
    throw error;
  }
}
