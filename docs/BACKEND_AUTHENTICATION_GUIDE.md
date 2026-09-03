# Backend Authentication Integration Guide

## Overview

The MPLADS frontend now supports **three authentication methods**:
1. **GovID** - Government Employee ID with Passcode
2. **Parichay SSO** - Parichay Single Sign-On Integration
3. **OTP** - One-Time Password via Email

All authentication flows are integrated with backend APIs through the `authApi` service.

---

## Backend Endpoints Required

### 1. GovID Authentication

#### Endpoint: `POST /auth/login-with-role`
**Purpose**: Authenticate government employee with role-based access

**Request:**
```json
{
  "email": "user@nic.in",
  "password": "passcode",
  "role": "ministry|mp|district|state_nodal|agency",
  "department": "optional_department_string"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "user@nic.in",
    "role": "ministry",
    "name": "User Name",
    "department": "Department Name"
  },
  "expiresIn": 86400
}
```

**Error Response (422):**
```json
{
  "success": false,
  "error": "Invalid credentials",
  "validationErrors": [
    {
      "loc": ["email"],
      "msg": "Invalid email format",
      "type": "value_error"
    }
  ]
}
```

---

### 2. Parichay SSO Integration

#### Endpoint: `POST /auth/parichay/initiate`
**Purpose**: Get Parichay authorization URL

**Request:**
```json
{
  "redirectUrl": "https://mplads.example.com/auth/parichay/callback"
}
```

**Response:**
```json
{
  "success": true,
  "authUrl": "https://parichay.gov.in/oauth/authorize?client_id=xxx&redirect_uri=xxx&state=xxx"
}
```

#### Endpoint: `POST /auth/parichay/callback`
**Purpose**: Handle Parichay SSO callback

**Request:**
```json
{
  "code": "authorization_code_from_parichay",
  "state": "state_parameter_for_verification"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "parichay_user_id",
    "email": "user@gov.in",
    "name": "User Name",
    "parichayId": "parichay_unique_id",
    "role": "auto_detected_role"
  },
  "expiresIn": 86400
}
```

#### Endpoint: `GET /auth/parichay/profile`
**Purpose**: Get Parichay user profile (requires valid token)

**Response:**
```json
{
  "success": true,
  "user": {
    "parichayId": "unique_id",
    "email": "user@gov.in",
    "name": "User Name",
    "department": "Department",
    "phone": "contact_number"
  }
}
```

---

### 3. OTP Authentication

#### Endpoint: `POST /auth/otp/request`
**Purpose**: Request OTP for email/SMS

**Request:**
```json
{
  "email": "user@nic.in",
  "channel": "email|sms"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent to your email",
  "otpId": "unique_otp_request_id",
  "expiresIn": 300
}
```

#### Endpoint: `POST /auth/otp/verify`
**Purpose**: Verify OTP and authenticate user

**Request:**
```json
{
  "otpId": "unique_otp_request_id",
  "otp": "123456",
  "email": "user@nic.in"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "user@nic.in",
    "role": "auto_detected_role",
    "name": "User Name"
  },
  "expiresIn": 86400
}
```

#### Endpoint: `POST /auth/otp/resend`
**Purpose**: Resend OTP

**Request:**
```json
{
  "otpId": "unique_otp_request_id"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP resent to your email",
  "expiresIn": 300
}
```

---

### 4. Token Management

#### Endpoint: `POST /auth/validate`
**Purpose**: Validate JWT token

**Request:**
```json
{
  "token": "jwt_token_here"
}
```

**Response:**
```json
{
  "success": true,
  "valid": true,
  "user": {
    "id": "user_id",
    "email": "user@nic.in",
    "role": "ministry"
  },
  "expiresIn": 3600
}
```

#### Endpoint: `GET /auth/roles`
**Purpose**: Get list of available roles

**Response:**
```json
{
  "success": true,
  "roles": [
    "ministry",
    "mp",
    "district",
    "state_nodal",
    "agency"
  ]
}
```

#### Endpoint: `POST /auth/logout`
**Purpose**: Invalidate token

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## Frontend Configuration

### Environment Variables

Set these in your `.env.local` file:

```env
VITE_API_URL=https://your-backend-api.com
VITE_PARICHAY_CLIENT_ID=your_parichay_client_id
VITE_PARICHAY_REDIRECT_URL=https://mplads.example.com/auth/parichay/callback
```

### API Base URL

The frontend expects the backend at the URL configured in `VITE_API_URL`. Default is `http://localhost:3000`.

Update in `src/services/api.ts`:
```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
```

---

## Authentication Flow

### 1. GovID Flow
```
User selects GovID tab
↓
Enters email + passcode + CAPTCHA
↓
Submits → POST /auth/login-with-role
↓
Backend validates credentials
↓
Returns JWT token
↓
Token stored in localStorage
↓
User redirected to dashboard
```

### 2. Parichay SSO Flow
```
User selects Parichay SSO tab
↓
Clicks "Sign In with Parichay"
↓
POST /auth/parichay/initiate → Get authUrl
↓
Redirect to Parichay login page
↓
User logs in at Parichay
↓
Parichay redirects back with authorization code
↓
POST /auth/parichay/callback
↓
Backend exchanges code for token
↓
JWT token returned and stored
↓
User logged in
```

### 3. OTP Flow
```
User selects OTP Login tab
↓
Enters email
↓
Clicks "Send OTP" → POST /auth/otp/request
↓
OTP sent to email
↓
otpId returned to frontend
↓
User enters 6-digit OTP
↓
Clicks "Verify OTP" → POST /auth/otp/verify
↓
Backend validates OTP
↓
Returns JWT token
↓
User logged in
```

---

## Role-Based Access Control (RBAC)

The application supports the following roles:

| Role | Description | Endpoints Access |
|------|-------------|-----------------|
| `ministry` | Ministry of Statistics & PI | All endpoints |
| `mp` | Member of Parliament | MP-specific views |
| `district` | District Authority/DM | District views |
| `state_nodal` | State Nodal Authority | State-level views |
| `agency` | Implementing Agency | Agency views |

Backend should validate user role and return appropriate:
- Dashboard data
- Report access
- Alert configurations
- User permissions

---

## Token Storage & Usage

### Frontend Token Management

Tokens are stored in browser's `localStorage`:
```typescript
localStorage.setItem('authToken', token);
localStorage.getItem('authToken');
localStorage.removeItem('authToken');
```

### Token in API Requests

All authenticated requests include the token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

### Token Expiration

Implement token refresh mechanism in backend:
- Access token: 24 hours
- Refresh token: 7 days
- Implement `/auth/refresh` endpoint

---

## Error Handling

### Common Error Codes

| Code | Message | Action |
|------|---------|--------|
| 401 | Unauthorized | Clear token, redirect to login |
| 403 | Forbidden | Show access denied message |
| 422 | Validation Error | Show field-specific errors |
| 500 | Server Error | Show generic error, log to backend |

### Fallback Authentication

If backend is unavailable, frontend falls back to mock authentication (development mode). This is for demo purposes only - production must have working backend.

---

## Security Considerations

1. **HTTPS Only**: Always use HTTPS in production
2. **CORS**: Configure CORS headers properly
3. **CAPTCHA**: Implement backend CAPTCHA validation
4. **OTP Validation**: Enforce OTP rate limiting (max 5 attempts)
5. **Token Security**:
   - Use secure, HTTP-only cookies (recommended over localStorage)
   - Implement token rotation
   - Validate token signature on backend
6. **Password Policy**:
   - Minimum 8 characters
   - Mix of uppercase, lowercase, numbers, special chars
   - No common patterns

---

## Testing Endpoints

### Test GovID Login
```bash
curl -X POST http://localhost:3000/auth/login-with-role \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin.mospi@nic.in",
    "password": "test_password",
    "role": "ministry"
  }'
```

### Test OTP Request
```bash
curl -X POST http://localhost:3000/auth/otp/request \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@nic.in",
    "channel": "email"
  }'
```

### Test Token Validation
```bash
curl -X POST http://localhost:3000/auth/validate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_jwt_token>" \
  -d '{
    "token": "<your_jwt_token>"
  }'
```

---

## Implementation Checklist

- [ ] Implement all 4 auth endpoint groups
- [ ] Configure Parichay OAuth client
- [ ] Set up OTP delivery service (email/SMS)
- [ ] Implement RBAC validation
- [ ] Add token refresh mechanism
- [ ] Configure CORS properly
- [ ] Add rate limiting for auth attempts
- [ ] Implement audit logging for auth events
- [ ] Test all three authentication flows
- [ ] Load testing for concurrent logins
- [ ] Security audit before production

---

## Support

For issues or questions:
1. Check the error logs in browser console
2. Check backend API logs
3. Verify endpoint URLs match configuration
4. Ensure tokens are valid and not expired
