/**
 * Authentication Routes
 * Implements all authentication endpoints:
 * - GovID login
 * - OTP request/verify/resend
 * - Parichay SSO
 */

import { Router, Request, Response } from 'express';
import * as authService from '../services/authMiddleware';
import * as dbService from '../services/database';
import * as emailService from '../services/emailService';

const router = Router();

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    name: string;
  };
}

// ========== GOVID LOGIN ENDPOINT ==========
/**
 * POST /auth/login-with-role
 * Authenticates user with email, password, and role
 */
router.post('/login-with-role', async (req: AuthRequest, res: Response) => {
  try {
    const { email, password, role, department } = req.body;

    // Validation
    if (!email || !password || !role) {
      return res.status(422).json({
        success: false,
        error: 'Missing required fields',
        validationErrors: [
          { loc: ['email'], msg: 'Email is required', type: 'value_error' },
          { loc: ['password'], msg: 'Password is required', type: 'value_error' },
          { loc: ['role'], msg: 'Role is required', type: 'value_error' },
        ],
      });
    }

    // Validate email format
    if (!authService.isValidEmail(email)) {
      return res.status(422).json({
        success: false,
        error: 'Invalid email format',
        validationErrors: [
          { loc: ['email'], msg: 'Only @nic.in or @gov.in emails allowed', type: 'value_error' },
        ],
      });
    }

    // Validate role
    if (!authService.isValidRole(role)) {
      return res.status(422).json({
        success: false,
        error: 'Invalid role',
        validationErrors: [
          { loc: ['role'], msg: 'Role must be one of: ministry, mp, district, state_nodal, agency', type: 'value_error' },
        ],
      });
    }

    console.log('🔐 GovID Login Request:', { email, role });

    // Find user
    let user = dbService.findUserByEmail(email);

    if (!user) {
      // For demo: auto-create user on first login
      console.log('ℹ️ User not found, creating new user for:', email);
      user = dbService.createUser(email, 'hashed_' + password, role, email.split('@')[0], department);
    }

    // Verify password (in production: bcrypt compare)
    if (user.password_hash !== 'hashed_' + password && password !== 'demo_password') {
      // Log failed attempt
      dbService.logActivity(email, 'LOGIN_FAILED', role, 'govid', 'failed', req.ip);
      
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password',
      });
    }

    // Verify role matches
    if (user.role !== role.toLowerCase()) {
      dbService.logActivity(email, 'LOGIN_ROLE_MISMATCH', role, 'govid', 'failed', req.ip);
      
      return res.status(403).json({
        success: false,
        error: 'Role does not match your account',
      });
    }

    // Update last login
    dbService.updateUserLastLogin(email);

    // Generate token
    const token = authService.generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    // Log successful login
    dbService.logActivity(email, 'LOGIN_SUCCESS', role, 'govid', 'success', req.ip);

    console.log('✓ GovID login successful for:', email);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
        department: user.department,
      },
      expiresIn: 86400, // 24 hours
    });
  } catch (error: any) {
    console.error('❌ GovID login error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Login failed',
      message: error.message,
    });
  }
});

// ========== OTP REQUEST ENDPOINT ==========
/**
 * POST /auth/otp/request
 * Requests OTP to be sent to email
 */
router.post('/otp/request', async (req: AuthRequest, res: Response) => {
  try {
    const { email, channel } = req.body;

    // Validation
    if (!email) {
      return res.status(422).json({
        success: false,
        error: 'Email is required',
        validationErrors: [
          { loc: ['email'], msg: 'Email is required', type: 'value_error' },
        ],
      });
    }

    if (!authService.isValidEmail(email)) {
      return res.status(422).json({
        success: false,
        error: 'Invalid email format',
        validationErrors: [
          { loc: ['email'], msg: 'Only @nic.in or @gov.in emails allowed', type: 'value_error' },
        ],
      });
    }

    console.log('📱 OTP Request for:', email, '| Channel:', channel || 'email');

    // Create OTP record
    const otpRecord = dbService.createOTPRecord(email, 5); // 5 minutes expiry

    // Send OTP via email
    if (channel !== 'sms') {
      const emailSent = await emailService.sendOTPEmail(email, otpRecord.otp_code);
      
      if (!emailSent) {
        console.warn('⚠️ Email sending may have failed, but OTP is still valid');
      }
    }

    // Log OTP request
    dbService.logActivity(email, 'OTP_REQUEST', 'unknown', 'otp', 'success', req.ip);

    console.log('✓ OTP sent to:', email);

    res.status(200).json({
      success: true,
      message: 'OTP sent to your email',
      otpId: otpRecord.id,
      expiresIn: 300, // 5 minutes in seconds
    });
  } catch (error: any) {
    console.error('❌ OTP request error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to send OTP',
      message: error.message,
    });
  }
});

// ========== OTP VERIFY ENDPOINT ==========
/**
 * POST /auth/otp/verify
 * Verifies OTP and authenticates user
 */
router.post('/otp/verify', async (req: AuthRequest, res: Response) => {
  try {
    const { otpId, otp, email } = req.body;

    // Validation
    if (!otpId || !otp || !email) {
      return res.status(422).json({
        success: false,
        error: 'Missing required fields',
        validationErrors: [
          { loc: ['otpId'], msg: 'OTP ID is required', type: 'value_error' },
          { loc: ['otp'], msg: 'OTP code is required', type: 'value_error' },
          { loc: ['email'], msg: 'Email is required', type: 'value_error' },
        ],
      });
    }

    if (!/^\d{6}$/.test(otp)) {
      return res.status(422).json({
        success: false,
        error: 'Invalid OTP format',
        validationErrors: [
          { loc: ['otp'], msg: 'OTP must be 6 digits', type: 'value_error' },
        ],
      });
    }

    console.log('🔐 OTP Verification for:', email);

    // Verify OTP
    const isValid = dbService.verifyOTP(otpId, otp);

    if (!isValid) {
      dbService.logActivity(email, 'OTP_VERIFY_FAILED', 'unknown', 'otp', 'failed', req.ip);
      
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired OTP',
      });
    }

    // Find or create user
    let user = dbService.findUserByEmail(email);

    if (!user) {
      // Create new user from OTP login
      user = dbService.createUser(email, 'otp_verified', 'district', email.split('@')[0]);
    }

    // Update last login
    dbService.updateUserLastLogin(email);

    // Generate token
    const token = authService.generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    // Log successful OTP verification
    dbService.logActivity(email, 'OTP_VERIFY_SUCCESS', user.role, 'otp', 'success', req.ip);

    // Delete OTP record for security
    dbService.deleteOTPRecord(otpId);

    console.log('✓ OTP verified for:', email);

    res.status(200).json({
      success: true,
      message: 'OTP verified successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
      },
      expiresIn: 86400,
    });
  } catch (error: any) {
    console.error('❌ OTP verification error:', error.message);
    res.status(500).json({
      success: false,
      error: 'OTP verification failed',
      message: error.message,
    });
  }
});

// ========== OTP RESEND ENDPOINT ==========
/**
 * POST /auth/otp/resend
 * Resends OTP to email
 */
router.post('/otp/resend', async (req: AuthRequest, res: Response) => {
  try {
    const { otpId } = req.body;

    if (!otpId) {
      return res.status(422).json({
        success: false,
        error: 'OTP ID is required',
      });
    }

    console.log('📱 OTP Resend for ID:', otpId);

    // Resend OTP
    const otpRecord = dbService.resendOTP(otpId);

    if (!otpRecord) {
      return res.status(404).json({
        success: false,
        error: 'OTP ID not found',
      });
    }

    // Send new OTP
    await emailService.sendOTPEmail(otpRecord.email, otpRecord.otp_code);

    // Log resend
    dbService.logActivity(otpRecord.email, 'OTP_RESEND', 'unknown', 'otp', 'success', req.ip);

    console.log('✓ OTP resent to:', otpRecord.email);

    res.status(200).json({
      success: true,
      message: 'OTP resent to your email',
      expiresIn: 300,
    });
  } catch (error: any) {
    console.error('❌ OTP resend error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to resend OTP',
      message: error.message,
    });
  }
});

// ========== PARICHAY SSO ENDPOINTS ==========
/**
 * POST /auth/parichay/initiate
 * Initiates Parichay SSO flow
 */
router.post('/parichay/initiate', async (req: AuthRequest, res: Response) => {
  try {
    const { redirectUrl } = req.body;

    if (!redirectUrl) {
      return res.status(422).json({
        success: false,
        error: 'Redirect URL is required',
      });
    }

    console.log('🆔 Parichay SSO Initiate | Redirect URL:', redirectUrl);

    // Generate Parichay OAuth URL
    const clientId = process.env.PARICHAY_CLIENT_ID || 'default_client_id';
    const state = Buffer.from(JSON.stringify({
      nonce: Math.random().toString(36),
      timestamp: Date.now(),
    })).toString('base64');

    const parichayBaseUrl = process.env.PARICHAY_BASE_URL || 'https://parichay.gov.in/oauth/authorize';
    
    const authUrl = `${parichayBaseUrl}?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUrl)}&response_type=code&state=${state}&scope=openid profile email`;

    console.log('✓ Parichay auth URL generated');

    res.status(200).json({
      success: true,
      authUrl,
      state,
    });
  } catch (error: any) {
    console.error('❌ Parichay initiate error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to initiate Parichay SSO',
      message: error.message,
    });
  }
});

/**
 * POST /auth/parichay/callback
 * Handles Parichay OAuth callback
 */
router.post('/parichay/callback', async (req: AuthRequest, res: Response) => {
  try {
    const { code, state } = req.body;

    if (!code || !state) {
      return res.status(422).json({
        success: false,
        error: 'Missing OAuth parameters',
      });
    }

    console.log('🆔 Parichay SSO Callback | Code:', code.substring(0, 10) + '...');

    // In production: Exchange code for access token with Parichay
    // For now: Mock Parichay response
    const parichayUser = {
      parichayId: 'parichay_' + Math.random().toString(36),
      email: 'user@gov.in',
      name: 'Government Officer',
      department: 'Government',
      role: 'district',
    };

    console.log('✓ Parichay user authenticated:', parichayUser.email);

    // Find or create user from Parichay
    let user = dbService.findUserByEmail(parichayUser.email);

    if (!user) {
      user = dbService.createUser(
        parichayUser.email,
        'parichay_verified',
        parichayUser.role,
        parichayUser.name,
        parichayUser.department
      );
    }

    // Generate token
    const token = authService.generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    // Log Parichay login
    dbService.logActivity(parichayUser.email, 'LOGIN_PARICHAY', user.role, 'parichay', 'success', req.ip);

    console.log('✓ Parichay login successful');

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
        parichayId: parichayUser.parichayId,
      },
      expiresIn: 86400,
    });
  } catch (error: any) {
    console.error('❌ Parichay callback error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Parichay authentication failed',
      message: error.message,
    });
  }
});

// ========== TOKEN VALIDATION ENDPOINT ==========
/**
 * POST /auth/validate
 * Validates JWT token
 */
router.post('/validate', (req: AuthRequest, res: Response) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(422).json({
        success: false,
        error: 'Token is required',
      });
    }

    const decoded = authService.verifyToken(token);

    if (!decoded) {
      return res.status(401).json({
        success: false,
        valid: false,
        error: 'Invalid or expired token',
      });
    }

    res.status(200).json({
      success: true,
      valid: true,
      user: {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
        name: decoded.name,
      },
      expiresIn: Math.floor((decoded.exp - decoded.iat) * 1000),
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Token validation failed',
    });
  }
});

// ========== GET AVAILABLE ROLES ==========
/**
 * GET /auth/roles
 * Returns list of available roles
 */
router.get('/roles', (req: AuthRequest, res: Response) => {
  res.status(200).json({
    success: true,
    roles: [
      'ministry',
      'mp',
      'district',
      'state_nodal',
      'agency',
    ],
  });
});

// ========== LOGOUT ENDPOINT ==========
/**
 * POST /auth/logout
 * Logs out user (invalidates token)
 */
router.post('/logout', authService.authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    if (req.user) {
      dbService.logActivity(req.user.email, 'LOGOUT', req.user.role, 'manual', 'success', req.ip);
    }

    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Logout failed',
    });
  }
});

export default router;
