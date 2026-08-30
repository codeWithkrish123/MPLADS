/**
 * DEPRECATED: Mock Data Module
 * 
 * This module is DEPRECATED and should no longer be used.
 * All data should come from the API service layer (src/services/api.ts)
 * 
 * These empty exports are kept for backwards compatibility during migration.
 * They will be removed in the next release.
 */

import {
  WorkRecord,
  NearDuplicatePair,
  RiskAlert,
  DistrictSummary,
  StateSummary,
  ImplementingAgency,
  ComplianceRule,
  AuditLogEntry,
} from "../types";

/**
 * EMPTY DATA ARRAYS - Production Ready
 * These are now empty and should be populated from real API endpoints
 */

export const MOCK_STATES: StateSummary[] = [];
export const MOCK_DISTRICTS: DistrictSummary[] = [];
export const MOCK_AGENCIES: ImplementingAgency[] = [];
export const MOCK_WORKS: WorkRecord[] = [];
export const MOCK_NEAR_DUPLICATES: NearDuplicatePair[] = [];

export const MOCK_ALERTS: RiskAlert[] = [];
export const MOCK_RULES: ComplianceRule[] = [];
export const MOCK_AUDIT_LOGS: AuditLogEntry[] = [];

/**
 * MIGRATION GUIDE
 * 
 * If you're seeing errors about these imports not providing data,
 * follow these steps:
 * 
 * 1. Remove imports from mockData.ts
 * 2. Import from src/services/api.ts instead
 * 3. Use the API service methods:
 *    - stateApi.getAll()
 *    - districtApi.getByState(stateName)
 *    - workApi.getAll(filters)
 *    - alertApi.getAll()
 *    - etc.
 * 
 * 4. Handle loading and error states in your components
 * 5. Update components to use useState and useEffect with API calls
 * 
 * Example:
 * 
 * // OLD (DEPRECATED)
 * import { MOCK_WORKS } from "./data/mockData";
 * const works = MOCK_WORKS;
 * 
 * // NEW (PRODUCTION)
 * import { workApi } from "./services/api";
 * const [works, setWorks] = useState([]);
 * const [loading, setLoading] = useState(true);
 * 
 * useEffect(() => {
 *   workApi.getAll()
 *     .then(setWorks)
 *     .catch(error => console.error(error))
 *     .finally(() => setLoading(false));
 * }, []);
 * 
 * if (loading) return <div>Loading...</div>;
 * if (works.length === 0) return <EmptyState />;
 * 
 * // Render works...
 */
