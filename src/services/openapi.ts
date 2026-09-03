/**
 * OpenAPI 3.1.0 Specification Generator for MPLADS ML Sentinel
 * Auto-generated from server.ts endpoints
 * 
 * Usage:
 *   - Access at: http://localhost:3000/api/spec
 *   - Documentation: http://localhost:3000/api/docs
 */

export const openApiSpec = {
  openapi: "3.1.0",
  info: {
    title: "MPLADS ML Sentinel API",
    description: "Real-time ML-driven risk analysis and compliance monitoring for MPLADS projects",
    version: "1.0.0",
    contact: {
      name: "MPLADS Team",
      email: "info@mplads.gov.in",
    },
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Development Server",
    },
    {
      url: "https://api.mplads.gov.in",
      description: "Production Server",
    },
  ],
  tags: [
    {
      name: "Health",
      description: "System health and status endpoints",
    },
    {
      name: "Projects",
      description: "Project management and analysis endpoints",
    },
    {
      name: "Investigations",
      description: "Investigation and anomaly detection endpoints",
    },
    {
      name: "Analytics",
      description: "Analytics and reporting endpoints",
    },
    {
      name: "System",
      description: "System information and metadata endpoints",
    },
  ],
  paths: {
    "/api/health": {
      get: {
        tags: ["Health"],
        summary: "Health Check",
        description: "Check if the ML Sentinel API is running and responsive",
        operationId: "healthCheck",
        responses: {
          "200": {
            description: "System is healthy",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "ok" },
                    platform: { type: "string", example: "MPLADS Sentinel" },
                    geminiAvailable: { type: "boolean" },
                    timestamp: { type: "string", format: "date-time" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/ml/projects": {
      get: {
        tags: ["Projects"],
        summary: "List Projects",
        description: "Get paginated list of projects with filtering and sorting",
        operationId: "getProjects",
        parameters: [
          {
            name: "page",
            in: "query",
            schema: { type: "integer", minimum: 1, default: 1 },
            description: "Page number for pagination",
          },
          {
            name: "page_size",
            in: "query",
            schema: { type: "integer", minimum: 1, maximum: 1000, default: 100 },
            description: "Records per page",
          },
          {
            name: "state",
            in: "query",
            schema: { type: "string" },
            description: "Filter by state name",
          },
          {
            name: "district",
            in: "query",
            schema: { type: "string" },
            description: "Filter by district name",
          },
          {
            name: "risk_level",
            in: "query",
            schema: { type: "string", enum: ["CRITICAL", "HIGH", "MEDIUM", "LOW"] },
            description: "Filter by risk level",
          },
          {
            name: "min_risk",
            in: "query",
            schema: { type: "number", minimum: 0, maximum: 100 },
            description: "Minimum risk score filter",
          },
          {
            name: "max_risk",
            in: "query",
            schema: { type: "number", minimum: 0, maximum: 100 },
            description: "Maximum risk score filter",
          },
          {
            name: "sort_order",
            in: "query",
            schema: { type: "string", enum: ["asc", "desc"], default: "desc" },
            description: "Sort order",
          },
        ],
        responses: {
          "200": {
            description: "List of projects",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    count: { type: "integer" },
                    total_matches: { type: "integer" },
                    page: { type: "integer" },
                    page_size: { type: "integer" },
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/ProjectDetail" },
                    },
                  },
                },
              },
            },
          },
          "422": {
            description: "Validation Error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ValidationError" },
              },
            },
          },
        },
      },
    },
    "/api/ml/projects/{project_id}": {
      get: {
        tags: ["Projects"],
        summary: "Get Project Details",
        description: "Get detailed analysis for a specific project",
        operationId: "getProjectDetails",
        parameters: [
          {
            name: "project_id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "Project ID (e.g., WS/MP203/2023-2024/10748)",
          },
        ],
        responses: {
          "200": {
            description: "Project details",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ProjectDetail" },
              },
            },
          },
          "404": {
            description: "Project not found",
          },
          "500": {
            description: "Internal server error",
          },
        },
      },
    },
    "/api/ml/investigations/{project_id}": {
      get: {
        tags: ["Investigations"],
        summary: "Get Investigation Data",
        description: "Get investigation details and recommended checks for a project",
        operationId: "getInvestigation",
        parameters: [
          {
            name: "project_id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": {
            description: "Investigation data",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/InvestigationData" },
              },
            },
          },
          "404": { description: "Investigation not found" },
          "500": { description: "Internal server error" },
        },
      },
    },
    "/api/ml/search": {
      get: {
        tags: ["Projects"],
        summary: "Search Projects",
        description: "Full-text search for projects",
        operationId: "searchProjects",
        parameters: [
          {
            name: "q",
            in: "query",
            required: true,
            schema: { type: "string", minLength: 1 },
            description: "Search query (work ID, name, or description)",
          },
          {
            name: "limit",
            in: "query",
            schema: { type: "integer", minimum: 1, maximum: 1000, default: 100 },
            description: "Maximum results to return",
          },
        ],
        responses: {
          "200": {
            description: "Search results",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/ProjectDetail" },
                },
              },
            },
          },
          "422": {
            description: "Validation Error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ValidationError" },
              },
            },
          },
        },
      },
    },
    "/api/ml/analyze": {
      post: {
        tags: ["Projects"],
        summary: "Analyze Project",
        description: "Real-time risk analysis for a hypothetical project",
        operationId: "analyzeProject",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ProjectAnalysisInput" },
            },
          },
        },
        responses: {
          "200": {
            description: "Analysis results",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/AnalysisResult" },
              },
            },
          },
          "422": {
            description: "Validation Error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ValidationError" },
              },
            },
          },
          "500": { description: "Analysis failed" },
        },
      },
    },
    "/api/dashboard/summary": {
      get: {
        tags: ["Analytics"],
        summary: "Dashboard Summary",
        description: "Get dashboard statistics and risk distribution",
        operationId: "getDashboardSummary",
        responses: {
          "200": {
            description: "Dashboard statistics",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/DashboardSummary" },
              },
            },
          },
        },
      },
    },
    "/api/investigations/priority": {
      get: {
        tags: ["Investigations"],
        summary: "Priority Investigations",
        description: "Get top priority investigations",
        operationId: "getPriorityInvestigations",
        parameters: [
          {
            name: "limit",
            in: "query",
            schema: { type: "integer", minimum: 1, maximum: 1000, default: 100 },
            description: "Maximum investigations to return",
          },
        ],
        responses: {
          "200": {
            description: "Priority investigations list",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/ProjectDetail" },
                },
              },
            },
          },
        },
      },
    },
    "/api/analytics/states": {
      get: {
        tags: ["Analytics"],
        summary: "State Analytics",
        description: "Analytics grouped by state",
        operationId: "getStateAnalytics",
        responses: {
          "200": {
            description: "State-wise analytics",
            content: {
              "application/json": {
                schema: { type: "object" },
              },
            },
          },
        },
      },
    },
    "/api/analytics/categories": {
      get: {
        tags: ["Analytics"],
        summary: "Category Analytics",
        description: "Analytics grouped by work category",
        operationId: "getCategoryAnalytics",
        responses: {
          "200": {
            description: "Category-wise analytics",
            content: {
              "application/json": {
                schema: { type: "object" },
              },
            },
          },
        },
      },
    },
    "/api/system/metadata": {
      get: {
        tags: ["System"],
        summary: "System Metadata",
        description: "System information and versioning",
        operationId: "getSystemMetadata",
        responses: {
          "200": {
            description: "System metadata",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SystemMetadata" },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      ProjectDetail: {
        type: "object",
        required: [
          "work_id_clean",
          "state",
          "district",
          "composite_risk_score",
          "risk_level",
        ],
        properties: {
          work_id_clean: { type: "string", example: "WS/MP203/2023-2024/10748" },
          work_description: { type: "string" },
          state: { type: "string" },
          district: { type: "string" },
          composite_risk_score: { type: "number", minimum: 0, maximum: 100 },
          risk_level: { type: "string", enum: ["CRITICAL", "HIGH", "MEDIUM", "LOW"] },
          sanction_amount: { type: "number" },
          total_expenditure: { type: "number" },
          cost_deviation_percent: { type: "number" },
          reason_codes: {
            type: "array",
            items: { type: "string" },
          },
          recommended_checks: {
            type: "array",
            items: { type: "string" },
          },
          evidence_confidence_score: { type: "number", minimum: 0, maximum: 100 },
        },
      },
      ProjectAnalysisInput: {
        type: "object",
        required: [
          "work_id",
          "district_name",
          "work_category",
          "work_description",
          "sanctioned_amount",
          "total_expenditure",
          "sanction_date",
          "work_status",
        ],
        properties: {
          work_id: { type: "string", description: "Unique project identifier" },
          district_name: { type: "string", description: "District name" },
          work_category: { type: "string", description: "Category of work" },
          work_description: { type: "string", description: "Project description" },
          sanctioned_amount: { type: "number", description: "Sanctioned cost in rupees" },
          total_expenditure: { type: "number", description: "Total expenditure so far" },
          sanction_date: { type: "string", format: "date", description: "Sanction date" },
          work_status: { type: "string", description: "Current project status" },
        },
      },
      AnalysisResult: {
        type: "object",
        properties: {
          risk_score: { type: "number", minimum: 0, maximum: 100 },
          risk_level: { type: "string" },
          recommendation: { type: "string" },
        },
      },
      DashboardSummary: {
        type: "object",
        properties: {
          total_analyzed: { type: "integer" },
          risk_distribution: { type: "object" },
          critical_count: { type: "integer" },
          high_count: { type: "integer" },
          average_risk_score: { type: "number" },
          average_confidence_score: { type: "number" },
        },
      },
      SystemMetadata: {
        type: "object",
        properties: {
          system_name: { type: "string" },
          pipeline_version: { type: "string" },
          feature_version: { type: "string" },
          model_version: { type: "string" },
        },
      },
      InvestigationData: {
        type: "object",
        properties: {
          project_id: { type: "string" },
          recommended_checks: { type: "array", items: { type: "string" } },
          investigation_checklist: { type: "array", items: { type: "string" } },
        },
      },
      ValidationError: {
        type: "object",
        properties: {
          status: { type: "integer", example: 422 },
          detail: {
            type: "array",
            items: {
              type: "object",
              properties: {
                loc: {
                  type: "array",
                  items: { oneOf: [{ type: "string" }, { type: "integer" }] },
                },
                msg: { type: "string" },
                type: { type: "string" },
              },
            },
          },
          timestamp: { type: "string", format: "date-time" },
          path: { type: "string" },
        },
      },
    },
  },
};

export default openApiSpec;
