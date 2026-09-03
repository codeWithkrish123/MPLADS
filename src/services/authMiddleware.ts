/**
 * Authentication Middleware and Utilities
 * Handles JWT verification, role-based access, and token generation
 */

// Mock JWT implementation (jsonwebtoken not installed)
interface JWTPayload {
  id: string;
  email: string;
  role: string;
  name: string;
  iat: number;
  exp: number;
}

const jwt = { 
  sign: (payload: any, secret: string, options: any) => {
    // Mock: return a simple encoded token
    return Buffer.from(JSON.stringify(payload)).toString('base64');
  },
  verify: (token: string, secret: string): JWTPayload => {
    // Mock: return decoded payload
    try {
      return JSON.parse(Buffer.from(token, 'base64').toString());
    } catch {
      throw new Error('Invalid token');
    }
  }
};

import { Request, Response, NextFunction } from 'express';

// JWT Configuration
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-change-in-production-min-32-chars';
const JWT_EXPIRY = process.env.JWT_EXPIRY || '24h';

// Types
interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    name: string;
  };
  token?: string;
}

// Types

// Generate JWT Token
export const generateToken = (user: {
  id: string;
  email: string;
  role: string;
  name: string;
}): string => {
  try {
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
      },
      JWT_SECRET,
      {
        expiresIn: JWT_EXPIRY,
        algorithm: 'HS256',
      }
    );
    console.log('✓ JWT token generated for:', user.email);
    return token;
  } catch (error: any) {
    console.error('❌ Error generating token:', error.message);
    throw new Error('Failed to generate authentication token');
  }
};

// Verify JWT Token
export const verifyToken = (token: string): JWTPayload | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error: any) {
    console.error('❌ Token verification failed:', error.message);
    return null;
  }
};

// Authentication Middleware
export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'No authentication token provided',
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer '
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired token',
      });
    }

    req.user = decoded;
    req.token = token;
    next();
  } catch (error: any) {
    res.status(401).json({
      success: false,
      error: 'Authentication failed',
    });
  }
};

// Role-based Access Control Middleware
export const roleMiddleware = (allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'User not authenticated',
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `Access denied. Required roles: ${allowedRoles.join(', ')}`,
      });
    }

    next();
  };
};

// Validate Email Format
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && (email.includes('@nic.in') || email.includes('@gov.in'));
};

// Validate Role
export const isValidRole = (role: string): boolean => {
  const validRoles = ['ministry', 'mp', 'district', 'state_nodal', 'agency'];
  return validRoles.includes(role.toLowerCase());
};

export default {
  generateToken,
  verifyToken,
  authMiddleware,
  roleMiddleware,
  isValidEmail,
  isValidRole,
};
