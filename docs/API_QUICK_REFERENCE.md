# Backend API Quick Reference

## Base URL
```
https://your-backend-api.com
```

## Auth Endpoints Summary

| Method | Endpoint | Purpose | Role |
|--------|----------|---------|------|
| `POST` | `/auth/login-with-role` | GovID Login | All |
| `POST` | `/auth/parichay/initiate` | Start Parichay SSO | Optional |
| `POST` | `/auth/parichay/callback` | Parichay Callback | Optional |
| `GET` | `/auth/parichay/profile` | Get Parichay Profile | Optional |
| `POST` | `/auth/otp/request` | Request OTP | All |
| `POST` | `/auth/otp/verify` | Verify OTP | All |
| `POST` | `/auth/otp/resend` | Resend OTP | All |
| `POST` | `/auth/validate` | Validate Token | Authenticated |
| `GET` | `/auth/roles` | Get Available Roles | Public |
| `POST` | `/auth/logout` | Logout | Authenticated |

---

## Authentication Flows

### 1️⃣ GovID Flow

**Step 1: Login Request**
```bash
POST /auth/login-with-role
Content-Type: application/json

{
  "email": "user@nic.in",
  "password": "passcode_123",
  "role": "ministry",
  "department": "Statistics"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user_123",
    "email": "user@nic.in",
    "role": "ministry",
    "name": "John Doe"
  },
  "expiresIn": 86400
}
```

---

### 2️⃣ Parichay SSO Flow

**Step 1: Get Authorization URL**
```bash
POST /auth/parichay/initiate
Content-Type: application/json

{
  "redirectUrl": "https://mplads.example.com/auth/parichay/callback"
}
```

**Response:**
```json
{
  "success": true,
  "authUrl": "https://parichay.gov.in/oauth/authorize?client_id=xxx&state=xxx"
}
```

**Step 2: Parichay Redirects Back with Code**
```
GET https://mplads.example.com/auth/parichay/callback?code=auth_code&state=state_value
```

**Step 3: Exchange Code for Token**
```bash
POST /auth/parichay/callback
Content-Type: application/json

{
  "code": "auth_code",
  "state": "state_value"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "parichay_user_456",
    "email": "user@gov.in",
    "name": "Jane Smith",
    "parichayId": "parichay_789"
  },
  "expiresIn": 86400
}
```

---

### 3️⃣ OTP Flow

**Step 1: Request OTP**
```bash
POST /auth/otp/request
Content-Type: application/json

{
  "email": "user@nic.in",
  "channel": "email"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent to user@nic.in",
  "otpId": "otp_req_abc123",
  "expiresIn": 300
}
```

**Step 2: Verify OTP**
```bash
POST /auth/otp/verify
Content-Type: application/json

{
  "otpId": "otp_req_abc123",
  "otp": "123456",
  "email": "user@nic.in"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user_789",
    "email": "user@nic.in",
    "role": "district",
    "name": "Ram Kumar"
  },
  "expiresIn": 86400
}
```

**Step 3: Resend OTP (if needed)**
```bash
POST /auth/otp/resend
Content-Type: application/json

{
  "otpId": "otp_req_abc123"
}
```

---

## Token Usage

After login, include token in all authenticated requests:

```bash
GET /api/dashboard
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

---

## Token Validation

Validate token at any time:

```bash
POST /auth/validate
Content-Type: application/json

{
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response:**
```json
{
  "success": true,
  "valid": true,
  "user": {
    "id": "user_123",
    "email": "user@nic.in",
    "role": "ministry"
  },
  "expiresIn": 3600
}
```

---

## Get Available Roles

```bash
GET /auth/roles
```

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

---

## Logout

```bash
POST /auth/logout
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## Error Responses

### 401 Unauthorized
```json
{
  "success": false,
  "error": "Invalid credentials"
}
```

### 422 Validation Error
```json
{
  "success": false,
  "error": "Validation error",
  "validationErrors": [
    {
      "loc": ["email"],
      "msg": "Invalid email format",
      "type": "value_error"
    }
  ]
}
```

### 500 Server Error
```json
{
  "success": false,
  "error": "Internal server error"
}
```

---

## Supported Roles

| Role | Description |
|------|-------------|
| `ministry` | Ministry of Statistics & PI (National HQ) |
| `mp` | Member of Parliament (Lok Sabha / Rajya Sabha) |
| `district` | District Authority / District Magistrate |
| `state_nodal` | State Nodal Authority (State Planning) |
| `agency` | Implementing Agency |

---

## Request Headers

All endpoints should accept:
```
Content-Type: application/json
Authorization: Bearer <token> (for authenticated endpoints)
```

---

## Testing Commands

### cURL Examples

**GovID Login:**
```bash
curl -X POST https://your-api.com/auth/login-with-role \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@nic.in",
    "password": "password123",
    "role": "ministry"
  }'
```

**Request OTP:**
```bash
curl -X POST https://your-api.com/auth/otp/request \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@nic.in",
    "channel": "email"
  }'
```

**Verify OTP:**
```bash
curl -X POST https://your-api.com/auth/otp/verify \
  -H "Content-Type: application/json" \
  -d '{
    "otpId": "otp_req_123",
    "otp": "654321",
    "email": "user@nic.in"
  }'
```

**Validate Token:**
```bash
curl -X POST https://your-api.com/auth/validate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "token": "YOUR_JWT_TOKEN"
  }'
```

---

## Response Timing

- GovID Login: < 2 seconds
- OTP Request: < 1 second (email sending async)
- OTP Verify: < 2 seconds
- Parichay Redirect: Immediate
- Token Validation: < 500ms

---

## Rate Limiting (Recommended)

- GovID Login: 5 attempts per minute per email
- OTP Request: 3 attempts per minute per email
- OTP Verify: 5 attempts per OTP session
- Auth Validate: No limit (high frequency)

---

## Security Headers (Recommended)

Backend should respond with:
```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000
```

---

## CORS Configuration (Recommended)

```
Access-Control-Allow-Origin: https://mplads.example.com
Access-Control-Allow-Methods: POST, GET, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Max-Age: 86400
```

---

## Notes

- All tokens should be JWT format
- All endpoints should validate input
- All endpoints should rate limit attempts
- OTP should expire after 5-10 minutes
- Tokens should expire after 24 hours
- Implement refresh token mechanism for long sessions
- Log all authentication attempts for audit
- Never log passwords or OTPs in plain text

---

Last Updated: 2026-09-01
Version: 1.0
