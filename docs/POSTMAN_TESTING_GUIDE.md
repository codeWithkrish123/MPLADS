# 📮 POSTMAN TESTING GUIDE - Complete API Collection

## Import the Collection

1. **Open Postman** (Download from https://www.postman.com/)
2. **Click "Import"** (Top left)
3. **Select File**: `MPLADS_API_Postman_Collection.json`
4. **Collection imported successfully!**

---

## 🧪 TEST SEQUENCE

### Test 1: GovID Authentication

#### Step 1: Send Request
```
Method: POST
URL: http://localhost:3000/auth/login-with-role

Body (raw JSON):
{
  "email": "admin.mospi@nic.in",
  "password": "demo_password",
  "role": "ministry",
  "department": "Ministry of Statistics"
}
```

#### Step 2: Check Response
```
Expected Status: 200 OK

Response:
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_1",
    "email": "admin.mospi@nic.in",
    "role": "ministry",
    "name": "admin",
    "department": "Ministry of Statistics"
  },
  "expiresIn": 86400
}
```

#### Step 3: Save Token
```
Copy the token from response
Save for next tests
```

---

### Test 2: Request OTP

#### Step 1: Send Request
```
Method: POST
URL: http://localhost:3000/auth/otp/request

Body (raw JSON):
{
  "email": "user@nic.in",
  "channel": "email"
}
```

#### Step 2: Check Response
```
Expected Status: 200 OK

Response:
{
  "success": true,
  "message": "OTP sent to your email",
  "otpId": "otp_1234567890",
  "expiresIn": 300
}
```

#### Step 3: Get OTP Code
```
Check backend console for OTP code
Or check email if configured
Example OTP: 345612
Save otpId for next test
```

---

### Test 3: Verify OTP

#### Step 1: Send Request
```
Method: POST
URL: http://localhost:3000/auth/otp/verify

Body (raw JSON):
{
  "otpId": "otp_1234567890",
  "otp": "345612",
  "email": "user@nic.in"
}
```

#### Step 2: Check Response
```
Expected Status: 200 OK

Response:
{
  "success": true,
  "message": "OTP verified successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_2",
    "email": "user@nic.in",
    "role": "district",
    "name": "user"
  },
  "expiresIn": 86400
}
```

#### Step 3: Save Token
```
Copy the token from response
```

---

### Test 4: Resend OTP

#### Step 1: Send Request
```
Method: POST
URL: http://localhost:3000/auth/otp/resend

Body (raw JSON):
{
  "otpId": "otp_1234567890"
}
```

#### Step 2: Check Response
```
Expected Status: 200 OK

Response:
{
  "success": true,
  "message": "OTP resent to your email",
  "expiresIn": 300
}
```

#### Step 3: Verify
```
New OTP generated and sent
Check backend console for new OTP code
```

---

### Test 5: Parichay SSO Initiate

#### Step 1: Send Request
```
Method: POST
URL: http://localhost:3000/auth/parichay/initiate

Body (raw JSON):
{
  "redirectUrl": "http://localhost:5173/auth/parichay/callback"
}
```

#### Step 2: Check Response
```
Expected Status: 200 OK

Response:
{
  "success": true,
  "authUrl": "https://parichay.gov.in/oauth/authorize?client_id=xxx&redirect_uri=...",
  "state": "base64_encoded_state"
}
```

#### Step 3: Get Auth URL
```
Copy the authUrl
In production: Redirect user to this URL
For testing: Can mock the callback
```

---

### Test 6: Parichay Callback

#### Step 1: Send Request
```
Method: POST
URL: http://localhost:3000/auth/parichay/callback

Body (raw JSON):
{
  "code": "authorization_code_xyz",
  "state": "state_xyz"
}
```

#### Step 2: Check Response
```
Expected Status: 200 OK

Response:
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "parichay_user_456",
    "email": "user@gov.in",
    "role": "mp",
    "name": "Government Officer",
    "parichayId": "parichay_unique_id"
  },
  "expiresIn": 86400
}
```

#### Step 3: Save Token
```
Copy token for authentication tests
```

---

### Test 7: Validate Token

#### Step 1: Get Token
```
Use token from any previous successful login
```

#### Step 2: Send Request
```
Method: POST
URL: http://localhost:3000/auth/validate

Headers:
Authorization: Bearer your_jwt_token_here
Content-Type: application/json

Body (raw JSON):
{
  "token": "your_jwt_token_here"
}
```

#### Step 3: Check Response
```
Expected Status: 200 OK

Response:
{
  "success": true,
  "valid": true,
  "user": {
    "id": "user_1",
    "email": "admin.mospi@nic.in",
    "role": "ministry",
    "name": "admin"
  },
  "expiresIn": 85000
}
```

---

### Test 8: Get Available Roles

#### Step 1: Send Request
```
Method: GET
URL: http://localhost:3000/auth/roles

No body needed
```

#### Step 2: Check Response
```
Expected Status: 200 OK

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
```

---

### Test 9: Logout

#### Step 1: Get Token
```
Use any valid JWT token from previous login
```

#### Step 2: Send Request
```
Method: POST
URL: http://localhost:3000/auth/logout

Headers:
Authorization: Bearer your_jwt_token_here
Content-Type: application/json

Body (raw JSON):
{}
```

#### Step 3: Check Response
```
Expected Status: 200 OK

Response:
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## 🎯 Error Test Cases

### Test: Invalid Email
```
Method: POST
URL: http://localhost:3000/auth/login-with-role

Body:
{
  "email": "invalid@gmail.com",
  "password": "demo_password",
  "role": "ministry"
}

Expected Status: 422 Unprocessable Entity

Response:
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

### Test: Invalid Role
```
Method: POST
URL: http://localhost:3000/auth/login-with-role

Body:
{
  "email": "admin.mospi@nic.in",
  "password": "demo_password",
  "role": "invalid_role"
}

Expected Status: 422 Unprocessable Entity

Response:
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

### Test: Wrong OTP
```
Method: POST
URL: http://localhost:3000/auth/otp/verify

Body:
{
  "otpId": "otp_1234567890",
  "otp": "000000",
  "email": "user@nic.in"
}

Expected Status: 401 Unauthorized

Response:
{
  "success": false,
  "error": "Invalid or expired OTP"
}
```

### Test: Invalid Token
```
Method: POST
URL: http://localhost:3000/auth/validate

Body:
{
  "token": "invalid_token_xyz"
}

Expected Status: 401 Unauthorized

Response:
{
  "success": false,
  "valid": false,
  "error": "Invalid or expired token"
}
```

---

## 📋 Test Scenarios

### Scenario 1: Complete GovID Flow
```
1. POST /auth/login-with-role (GovID)
   ✓ Get token
   ✓ Save user info
2. POST /auth/validate
   ✓ Verify token
3. POST /auth/logout
   ✓ Logout user
```

### Scenario 2: Complete OTP Flow
```
1. POST /auth/otp/request
   ✓ Get otpId
2. Check console for OTP
3. POST /auth/otp/verify
   ✓ Get token
4. POST /auth/validate
   ✓ Verify token
```

### Scenario 3: OTP Resend
```
1. POST /auth/otp/request
   ✓ Get otpId
2. POST /auth/otp/resend
   ✓ Get new OTP
3. POST /auth/otp/verify
   ✓ Verify new OTP
```

### Scenario 4: Complete Parichay Flow
```
1. POST /auth/parichay/initiate
   ✓ Get authUrl
2. POST /auth/parichay/callback
   ✓ Get token
3. POST /auth/validate
   ✓ Verify token
```

---

## 🔐 Headers Reference

### Authorization Header
```
Key: Authorization
Value: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

This is required for:
- POST /auth/validate
- POST /auth/logout
```

### Content-Type Header
```
Key: Content-Type
Value: application/json

Required for all POST requests
```

---

## 📊 Valid Values Reference

### Valid Emails
```
- admin.mospi@nic.in
- user@nic.in
- officer@gov.in
- Any email ending with @nic.in or @gov.in
```

### Valid Roles
```
- ministry
- mp
- district
- state_nodal
- agency
```

### Valid Channels
```
- email (default)
- sms (optional)
```

### OTP Format
```
- Exactly 6 digits
- Example: 123456, 654321, 000000
```

---

## 💡 Tips for Testing

1. **Save Tokens**
   - Copy tokens from successful responses
   - Use for validation and logout tests

2. **Check Backend Console**
   - Backend logs show activity
   - OTP codes displayed for testing

3. **Use Variables**
   - Set base_url = http://localhost:3000
   - Set jwt_token = from response

4. **Test Error Cases**
   - Invalid email
   - Invalid role
   - Wrong OTP
   - Expired token

5. **Check Response Times**
   - Should be < 500ms
   - If slow, check backend performance

6. **Monitor Activity Logs**
   - Backend console shows all events
   - Verify successful logins are logged

---

## ✅ Complete Test Checklist

- [ ] GovID Login (200 OK)
- [ ] OTP Request (200 OK)
- [ ] OTP Verify (200 OK)
- [ ] OTP Resend (200 OK)
- [ ] Parichay Initiate (200 OK)
- [ ] Parichay Callback (200 OK)
- [ ] Validate Token (200 OK)
- [ ] Get Roles (200 OK)
- [ ] Logout (200 OK)
- [ ] Invalid Email (422 Error)
- [ ] Invalid Role (422 Error)
- [ ] Wrong OTP (401 Error)
- [ ] Invalid Token (401 Error)

---

## 🚀 Next Steps

1. Import the collection into Postman
2. Update base_url if using different server
3. Run all test cases in sequence
4. Save tokens for later use
5. Verify all responses match expected
6. Check backend console logs
7. Test error scenarios
8. Ready for production!

---

**All endpoints are ready for testing in Postman!** 🎉

