# 📮 POSTMAN QUICK REFERENCE - All Endpoints

## Import Collection
```
File: MPLADS_API_Postman_Collection.json
In Postman: Import → Select File → Collection Imported
```

---

## 🔐 GovID Login
```
POST http://localhost:3000/auth/login-with-role

Body (JSON):
{
  "email": "admin.mospi@nic.in",
  "password": "demo_password",
  "role": "ministry"
}

Response:
{
  "success": true,
  "token": "JWT_TOKEN_HERE",
  "user": {...},
  "expiresIn": 86400
}

Status: 200 OK
```

---

## 📱 OTP Request
```
POST http://localhost:3000/auth/otp/request

Body (JSON):
{
  "email": "user@nic.in",
  "channel": "email"
}

Response:
{
  "success": true,
  "message": "OTP sent to your email",
  "otpId": "otp_1234567890",
  "expiresIn": 300
}

Status: 200 OK
```

---

## ✅ OTP Verify
```
POST http://localhost:3000/auth/otp/verify

Body (JSON):
{
  "otpId": "otp_1234567890",
  "otp": "123456",
  "email": "user@nic.in"
}

Response:
{
  "success": true,
  "token": "JWT_TOKEN_HERE",
  "user": {...},
  "expiresIn": 86400
}

Status: 200 OK
Note: Get OTP from backend console
```

---

## 🔄 OTP Resend
```
POST http://localhost:3000/auth/otp/resend

Body (JSON):
{
  "otpId": "otp_1234567890"
}

Response:
{
  "success": true,
  "message": "OTP resent to your email",
  "expiresIn": 300
}

Status: 200 OK
```

---

## 🆔 Parichay SSO Initiate
```
POST http://localhost:3000/auth/parichay/initiate

Body (JSON):
{
  "redirectUrl": "http://localhost:5173/auth/parichay/callback"
}

Response:
{
  "success": true,
  "authUrl": "https://parichay.gov.in/oauth/authorize?...",
  "state": "base64_state"
}

Status: 200 OK
```

---

## 🔗 Parichay Callback
```
POST http://localhost:3000/auth/parichay/callback

Body (JSON):
{
  "code": "authorization_code",
  "state": "state_value"
}

Response:
{
  "success": true,
  "token": "JWT_TOKEN_HERE",
  "user": {...},
  "expiresIn": 86400
}

Status: 200 OK
```

---

## ✔️ Validate Token
```
POST http://localhost:3000/auth/validate

Headers:
Authorization: Bearer JWT_TOKEN_HERE
Content-Type: application/json

Body (JSON):
{
  "token": "JWT_TOKEN_HERE"
}

Response:
{
  "success": true,
  "valid": true,
  "user": {...},
  "expiresIn": 85000
}

Status: 200 OK
```

---

## 📋 Get Roles
```
GET http://localhost:3000/auth/roles

No body needed

Response:
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

Status: 200 OK
```

---

## 🚪 Logout
```
POST http://localhost:3000/auth/logout

Headers:
Authorization: Bearer JWT_TOKEN_HERE
Content-Type: application/json

Body (JSON):
{}

Response:
{
  "success": true,
  "message": "Logged out successfully"
}

Status: 200 OK
```

---

## Valid Email Domains
```
@nic.in
@gov.in

Example:
- admin.mospi@nic.in ✓
- user@nic.in ✓
- officer@gov.in ✓
- user@gmail.com ✗
```

---

## Valid Roles
```
ministry
mp
district
state_nodal
agency
```

---

## Test OTP Codes
```
For Testing: Check backend console
Example: 123456 (any 6 digits)

Expires in: 5 minutes
Max attempts: 5
Resend available: Yes
```

---

## Error Responses

### Invalid Email (422)
```json
{
  "success": false,
  "error": "Invalid email format",
  "validationErrors": [
    {
      "loc": ["email"],
      "msg": "Only @nic.in or @gov.in emails allowed",
      "type": "value_error"
    }
  ]
}
```

### Invalid Role (422)
```json
{
  "success": false,
  "error": "Invalid role",
  "validationErrors": [
    {
      "loc": ["role"],
      "msg": "Role must be one of: ministry, mp, district, state_nodal, agency",
      "type": "value_error"
    }
  ]
}
```

### Wrong OTP (401)
```json
{
  "success": false,
  "error": "Invalid or expired OTP"
}
```

### Invalid Token (401)
```json
{
  "success": false,
  "valid": false,
  "error": "Invalid or expired token"
}
```

---

## Test Order

1. **GET /auth/roles** - See available roles
2. **POST /auth/login-with-role** - GovID login
3. **POST /auth/otp/request** - Request OTP
4. **POST /auth/otp/verify** - Verify OTP
5. **POST /auth/validate** - Validate token
6. **POST /auth/logout** - Logout

---

## Quick Postman Setup

```
1. Open Postman
2. Import → MPLADS_API_Postman_Collection.json
3. Go to Variables tab
4. Set: base_url = http://localhost:3000
5. Set: jwt_token = (from login response)
6. Start testing!
```

---

## Headers Always Include
```
Content-Type: application/json
Authorization: Bearer TOKEN (where needed)
```

---

## Frontend Testing
```
After verifying all endpoints work:
1. Open http://localhost:5173
2. Click Login button
3. Test GovID, OTP, Parichay
4. Verify token stored in localStorage
5. Dashboard loads
```

---

**All 9 endpoints ready for testing!** ✅

