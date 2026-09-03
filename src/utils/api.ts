/// <reference types="vite/client" />
/**
 * API Client for MPLADS Backend
 * Handles all HTTP requests with proper error handling and logging
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  [key: string]: any;
}

interface LoginRequest {
  email: string;
  password: string;
  role: string;
  department?: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
  user: {
    id: string;
    email: string;
    role: string;
    department?: string;
  };
  token: string;
  authMethod: string;
}

/**
 * Generic API request handler
 */
async function apiRequest<T>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  body?: any,
  token?: string | null
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    console.log(`🌐 ${method} ${endpoint}`);

    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(`❌ API Error [${response.status}]:`, data);
      throw new Error(data.error || data.message || `API Error: ${response.status}`);
    }

    console.log(`✅ API Success:`, data);
    return data;
  } catch (error: any) {
    console.error(`🔥 Request Error:`, error.message);
    throw error;
  }
}

/**
 * Login with email, password, and role
 */
export async function loginWithRole(
  email: string,
  password: string,
  role: string
): Promise<LoginResponse> {
  const response = await apiRequest<LoginResponse>(
    '/auth/login-with-role',
    'POST',
    {
      email,
      password,
      role,
    } as LoginRequest
  );

  if (!response.success) {
    throw new Error(response.error || response.message || 'Login failed');
  }

  return response as LoginResponse;
}

/**
 * Standard login (without role selection)
 */
export async function login(
  email: string,
  password: string
): Promise<LoginResponse> {
  const response = await apiRequest<LoginResponse>(
    '/auth/login',
    'POST',
    {
      email,
      password,
    }
  );

  if (!response.success) {
    throw new Error(response.error || response.message || 'Login failed');
  }

  return response as LoginResponse;
}

/**
 * Request OTP
 */
export async function requestOTP(email: string, channel: 'email' | 'sms' = 'email') {
  const response = await apiRequest(
    '/auth/otp/request',
    'POST',
    {
      email,
      channel,
    }
  );

  if (!response.success) {
    throw new Error(response.error || response.message || 'OTP request failed');
  }

  return response;
}

/**
 * Verify OTP and login
 */
export async function verifyOTP(
  otpId: string,
  otp: string,
  email: string,
  role?: string
) {
  const response = await apiRequest<LoginResponse>(
    '/auth/otp/verify',
    'POST',
    {
      otpId,
      otp,
      email,
      role: role || 'ministry',
    }
  );

  if (!response.success) {
    throw new Error(response.error || response.message || 'OTP verification failed');
  }

  return response as LoginResponse;
}

/**
 * Resend OTP
 */
export async function resendOTP(otpId: string) {
  const response = await apiRequest(
    '/auth/otp/resend',
    'POST',
    { otpId }
  );

  if (!response.success) {
    throw new Error(response.error || response.message || 'OTP resend failed');
  }

  return response;
}

/**
 * Logout
 */
export async function logout(token: string) {
  try {
    await apiRequest(
      '/auth/logout',
      'POST',
      {},
      token
    );
  } catch (error) {
    console.warn('Logout request failed, clearing local session anyway', error);
  }
}

/**
 * Get user profile
 */
export async function getUserProfile(token: string) {
  const response = await apiRequest(
    '/auth/profile',
    'GET',
    undefined,
    token
  );

  return response;
}

/**
 * Get available roles
 */
export async function getRoles() {
  const response = await apiRequest(
    '/auth/roles',
    'GET'
  );

  return response;
}

/**
 * Register new user
 */
export async function registerUser(
  email: string,
  password: string,
  role: string
) {
  const response = await apiRequest<LoginResponse>(
    '/auth/register',
    'POST',
    {
      email,
      password,
      role,
    }
  );

  if (!response.success) {
    throw new Error(response.error || response.message || 'Registration failed');
  }

  return response as LoginResponse;
}

/**
 * Forgot password request
 */
export async function forgotPassword(email: string) {
  const response = await apiRequest(
    '/auth/forgot-password',
    'POST',
    { email }
  );

  if (!response.success) {
    throw new Error(response.error || response.message || 'Password reset request failed');
  }

  return response;
}

export default {
  loginWithRole,
  login,
  requestOTP,
  verifyOTP,
  resendOTP,
  logout,
  getUserProfile,
  getRoles,
  registerUser,
  forgotPassword,
};
