import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './AppRoutes.tsx';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { AuthProvider } from './context/AuthContext';
import config from './config/featureFlags';
import './index.css';

// Show startup message
console.log('🔧 MPLADS Frontend Starting...');
console.log(`Mode: ${config.useMockData ? '📦 MOCK DATA (no backend)' : '🔌 REAL API (backend required)'}`);
if (config.useMockData) {
  console.log('ℹ️ Mock mode enabled - frontend works offline, no backend needed!');
} else {
  console.log(`ℹ️ Real API mode enabled - connecting to ${config.apiUrl}`);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ErrorBoundary>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ErrorBoundary>
    </BrowserRouter>
  </StrictMode>,
);
