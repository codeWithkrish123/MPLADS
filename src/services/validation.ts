import { z } from 'zod';

/**
 * Validation Schemas for all backend endpoints
 * Uses Zod for type-safe validation
 */

// ============================================================
// QUERY PARAMETER SCHEMAS
// ============================================================

export const ProjectsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1).optional(),
  page_size: z.coerce.number().int().min(1).max(1000).default(100).optional(),
  state: z.string().optional(),
  district: z.string().optional(),
  risk_level: z.enum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']).optional(),
  work_category: z.string().optional(),
  min_risk: z.coerce.number().min(0).max(100).optional(),
  max_risk: z.coerce.number().min(0).max(100).optional(),
  sort_by: z.string().optional(),
  sort_order: z.enum(['asc', 'desc']).default('desc').optional(),
}).strict();

export const SearchQuerySchema = z.object({
  q: z.string().min(1, 'Search query required'),
  limit: z.coerce.number().int().min(1).max(1000).default(100).optional(),
}).strict();

export const InvestigationsQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(1000).default(100).optional(),
}).strict();

export const DashboardQuerySchema = z.object({}).strict();

export const AnalyticsQuerySchema = z.object({}).strict();

export const MetadataQuerySchema = z.object({}).strict();

// ============================================================
// REQUEST BODY SCHEMAS
// ============================================================

export const AnalyzeProjectSchema = z.object({
  work_id: z.string().min(1, 'Work ID required'),
  district_name: z.string().min(1, 'District name required'),
  work_category: z.string().min(1, 'Category required'),
  work_description: z.string().min(1, 'Description required'),
  sanctioned_amount: z.number().positive('Sanctioned amount must be positive'),
  total_expenditure: z.number().nonnegative('Expenditure cannot be negative'),
  sanction_date: z.string().min(1, 'Sanction date required'),
  work_status: z.string().min(1, 'Work status required'),
}).strict();

// ============================================================
// TYPE EXPORTS (for TypeScript usage)
// ============================================================

export type ProjectsQuery = z.infer<typeof ProjectsQuerySchema>;
export type SearchQuery = z.infer<typeof SearchQuerySchema>;
export type InvestigationsQuery = z.infer<typeof InvestigationsQuerySchema>;
export type AnalyzeProject = z.infer<typeof AnalyzeProjectSchema>;

// ============================================================
// VALIDATION HELPER FUNCTION
// ============================================================

export function validateSchema<T>(schema: z.ZodSchema<T>, data: unknown): {
  success: boolean;
  data?: T;
  errors?: Array<{ path: string; message: string }>;
} {
  try {
    const result = schema.parse(data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.issues.map((err) => ({
        path: err.path.join('.'),
        message: err.message,
      }));
      return { success: false, errors };
    }
    return {
      success: false,
      errors: [{ path: 'unknown', message: 'Validation failed' }],
    };
  }
}
