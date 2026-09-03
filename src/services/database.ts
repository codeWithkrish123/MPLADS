/**
 * Database Models and Queries
 * Handles user management, OTP storage, and activity logging
 */

// In-memory storage (replace with actual database in production)
// For production, use PostgreSQL, MongoDB, or your preferred database

interface User {
  id: string;
  email: string;
  password_hash: string;
  role: string;
  name: string;
  department?: string;
  created_at: Date;
  last_login?: Date;
}

interface OTPRecord {
  id: string;
  email: string;
  otp_code: string;
  created_at: Date;
  expires_at: Date;
  verified: boolean;
  attempts: number;
}

interface ActivityLog {
  id: string;
  email: string;
  action: string;
  role: string;
  method: string;
  timestamp: Date;
  ip_address?: string;
  status: string;
}

// In-memory storage
const usersDB: Map<string, User> = new Map();
const otpDB: Map<string, OTPRecord> = new Map();
const activityLogsDB: ActivityLog[] = [];

// Seed some test users
const initializeTestUsers = () => {
  const testUsers: User[] = [
    {
      id: 'user_1',
      email: 'admin.mospi@nic.in',
      password_hash: 'hashed_password_123', // In production: bcrypt hash
      role: 'ministry',
      name: 'Admin Officer',
      department: 'Ministry of Statistics',
      created_at: new Date(),
    },
    {
      id: 'user_2',
      email: 'mp@sansad.nic.in',
      password_hash: 'hashed_password_456',
      role: 'mp',
      name: 'Member of Parliament',
      department: 'Lok Sabha',
      created_at: new Date(),
    },
    {
      id: 'user_3',
      email: 'dm@nic.in',
      password_hash: 'hashed_password_789',
      role: 'district',
      name: 'District Magistrate',
      department: 'Ghaziabad',
      created_at: new Date(),
    },
  ];

  testUsers.forEach(user => {
    usersDB.set(user.email, user);
  });

  console.log('✓ Test users initialized:', testUsers.length);
};

// USER OPERATIONS

export const findUserByEmail = (email: string): User | undefined => {
  return usersDB.get(email.toLowerCase());
};

export const getUserById = (id: string): User | undefined => {
  for (const user of usersDB.values()) {
    if (user.id === id) return user;
  }
  return undefined;
};

export const createUser = (email: string, passwordHash: string, role: string, name: string, department?: string): User => {
  const user: User = {
    id: `user_${Date.now()}`,
    email: email.toLowerCase(),
    password_hash: passwordHash,
    role: role.toLowerCase(),
    name,
    department,
    created_at: new Date(),
  };

  usersDB.set(email.toLowerCase(), user);
  console.log('✓ User created:', email);
  return user;
};

export const updateUserLastLogin = (email: string): void => {
  const user = findUserByEmail(email);
  if (user) {
    user.last_login = new Date();
  }
};

// OTP OPERATIONS

export const generateOTP = (): string => {
  // Generate 6-digit OTP
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const createOTPRecord = (email: string, expiryMinutes: number = 5): OTPRecord => {
  const otpCode = generateOTP();
  const otpId = `otp_${Date.now()}`;
  const now = new Date();
  const expiresAt = new Date(now.getTime() + expiryMinutes * 60000);

  const otpRecord: OTPRecord = {
    id: otpId,
    email: email.toLowerCase(),
    otp_code: otpCode,
    created_at: now,
    expires_at: expiresAt,
    verified: false,
    attempts: 0,
  };

  otpDB.set(otpId, otpRecord);
  console.log('✓ OTP created for:', email, '| OTP ID:', otpId, '| Expires in:', expiryMinutes, 'minutes');
  return otpRecord;
};

export const getOTPRecord = (otpId: string): OTPRecord | undefined => {
  return otpDB.get(otpId);
};

export const verifyOTP = (otpId: string, providedOTP: string): boolean => {
  const record = getOTPRecord(otpId);

  if (!record) {
    console.log('❌ OTP record not found:', otpId);
    return false;
  }

  // Check if expired
  if (new Date() > record.expires_at) {
    console.log('❌ OTP expired for:', record.email);
    return false;
  }

  // Check attempts
  if (record.attempts >= 5) {
    console.log('❌ OTP attempts exceeded for:', record.email);
    return false;
  }

  record.attempts++;

  // Check OTP code
  if (record.otp_code === providedOTP) {
    record.verified = true;
    console.log('✓ OTP verified for:', record.email);
    return true;
  }

  console.log('❌ OTP incorrect for:', record.email, '| Attempt:', record.attempts);
  return false;
};

export const resendOTP = (otpId: string): OTPRecord | null => {
  const record = getOTPRecord(otpId);

  if (!record) {
    console.log('❌ OTP record not found for resend:', otpId);
    return null;
  }

  // Generate new OTP
  const newOTP = generateOTP();
  record.otp_code = newOTP;
  record.created_at = new Date();
  record.expires_at = new Date(record.created_at.getTime() + 5 * 60000); // 5 minutes
  record.attempts = 0;
  record.verified = false;

  console.log('✓ OTP resent for:', record.email);
  return record;
};

export const deleteOTPRecord = (otpId: string): void => {
  otpDB.delete(otpId);
  console.log('✓ OTP record deleted:', otpId);
};

// ACTIVITY LOGGING

export const logActivity = (email: string, action: string, role: string, method: string, status: string, ipAddress?: string): void => {
  const log: ActivityLog = {
    id: `log_${Date.now()}`,
    email,
    action,
    role,
    method,
    timestamp: new Date(),
    ip_address: ipAddress,
    status,
  };

  activityLogsDB.push(log);
  console.log('📝 Activity logged:', { email, action, method, status });
};

export const getActivityLogs = (email?: string, action?: string, limit: number = 100): ActivityLog[] => {
  let logs = [...activityLogsDB];

  if (email) {
    logs = logs.filter(l => l.email === email);
  }

  if (action) {
    logs = logs.filter(l => l.action === action);
  }

  return logs.slice(-limit).reverse();
};

// Export functions
export default {
  // User operations
  findUserByEmail,
  getUserById,
  createUser,
  updateUserLastLogin,

  // OTP operations
  generateOTP,
  createOTPRecord,
  getOTPRecord,
  verifyOTP,
  resendOTP,
  deleteOTPRecord,

  // Activity logging
  logActivity,
  getActivityLogs,

  // Initialization
  initializeTestUsers,
};

// Initialize test users on module load
initializeTestUsers();
