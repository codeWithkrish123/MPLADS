/**
 * Feature Flags & Configuration
 * 
 * Controls which mode the frontend runs in:
 * - Mock Mode: Uses hardcoded mock data (no backend needed)
 * - Real Mode: Calls backend API
 */

export const config = {
  // ========== MODE CONTROL ==========
  // Set to true to use mock data only (no backend calls)
  // Set to false to use real backend API
  useMockData: import.meta.env.VITE_USE_MOCK_DATA === 'true',

  // ========== API ENDPOINTS ==========
  apiUrl: import.meta.env.VITE_API_URL || 'https://mplads-backend-gateway.aditya93193.workers.dev/api',
  mlApiUrl: import.meta.env.VITE_ML_API_URL || 'https://sih-2026-23oy.onrender.com/api',

  // ========== AUTHENTICATION ==========
  authTokenKey: import.meta.env.VITE_AUTH_TOKEN_KEY || 'auth_token',
  authUserKey: import.meta.env.VITE_AUTH_USER_KEY || 'auth_user',

  // ========== FEATURES ==========
  enablePolling: import.meta.env.VITE_ENABLE_POLLING === 'true',
  pollingInterval: parseInt(import.meta.env.VITE_POLLING_INTERVAL || '30000'),

  // ========== LOGGING ==========
  logLevel: (import.meta.env.VITE_LOG_LEVEL || 'info') as 'debug' | 'info' | 'warn' | 'error',
}

// Log the current mode on startup
console.log('🔧 Frontend Configuration:')
console.log(`   Mode: ${config.useMockData ? '📦 MOCK DATA (no backend)' : '🔌 REAL API (backend required)'}`)
console.log(`   API URL: ${config.apiUrl}`)
console.log(`   Polling: ${config.enablePolling ? 'ON' : 'OFF'}`)

export default config
