# ✅ COMPLETE END-TO-END TESTING GUIDE

## Everything Works Together - UI + Backend Verification

---

## 🎯 BEFORE YOU START

Make sure you have:
1. ✅ Frontend running (`npm run dev`)
2. ✅ Backend server running with auth routes
3. ✅ All backend files in `src/services/`:
   - `authMiddleware.ts`
   - `database.ts`
   - `emailService.ts`
   - `authRoutes.ts`
4. ✅ `.env.local` configured with JWT_SECRET

---

## 🧪 TEST 1: GovID Authentication (Full Flow)

### Frontend Action
```
1. Open: http://localhost:5173
2. Click "Explore Dashboard" or "Login" button
3. Sign-In Modal opens
4. Select Role: "Ministry of Statistics"
5. Select Tab: "GovID"
```

### Frontend UI Input
```
Email: admin.mospi@nic.in
Passcode: demo_password
CAPTCHA: any value (7P9xE shown)
```

### What Happens Behind the Scenes

**Frontend:**
```
1. User clicks "Sign In" button
2. Validates form (email, passcode)
3. Calls: authApi.loginWithRole(email, passcode, role)
```

**Backend:**
```
Receives: POST /auth/login-with-role
{
  "email": "admin.mospi@nic.in",
  "password": "demo_password",
  "role": "ministry"
}

Backend validates:
✓ Email format (@nic.in/@gov.in)
✓ Password provided
✓ Role valid

Creates user if doesn't exist
Generates JWT token
Returns token + user data
```

**Frontend:**
```
Receives JWT token
Stores in localStorage:
  - authToken
  - userRole
  - userEmail

Redirects to dashboard
```

### Expected Result
✅ Login successful
✅ Token stored
✅ User can access dashboard
✅ Activity logged: LOGIN_SUCCESS

### How to Verify
```bash
# Open browser DevTools (F12)
# Go to Console
> localStorage.getItem('authToken')
# Should return: long JWT token string
```

---

## 🧪 TEST 2: OTP Authentication (Full Flow)

### Frontend Action
```
1. Open: http://localhost:5173
2. Click "Login" button
3. Sign-In Modal opens
4. Select Role: "District Authority"
5. Select Tab: "OTP"
```

### Step 1: Request OTP

**Frontend UI:**
```
Email: user@nic.in
Click "Send OTP"
```

**What Happens:**

**Frontend:**
```
1. Validates email format
2. Calls: authApi.otp.requestOTP(email)
```

**Backend:**
```
Receives: POST /auth/otp/request
{
  "email": "user@nic.in",
  "channel": "email"
}

Backend:
✓ Validates email format
✓ Generates 6-digit OTP (e.g., 345612)
✓ Creates OTP record with 5-min expiry
✓ Sends email via Nodemailer
✓ Returns otpId
```

**Frontend:**
```
Receives:
{
  "success": true,
  "otpId": "otp_1234567890",
  "expiresIn": 300
}

OTP form appears
User can see input field for 6-digit OTP
```

### Expected Result
✅ OTP sent to email
✅ Form changes to OTP verification
✅ Check email for OTP code

### Step 2: Verify OTP

**Frontend UI:**
```
Email field disabled (shows: user@nic.in)
OTP input field active
Enter 6-digit OTP from email
Click "Verify OTP"
```

**What Happens:**

**Frontend:**
```
1. Validates OTP is 6 digits
2. Calls: authApi.otp.verifyOTP(otpId, otp, email)
```

**Backend:**
```
Receives: POST /auth/otp/verify
{
  "otpId": "otp_1234567890",
  "otp": "345612",
  "email": "user@nic.in"
}

Backend validates:
✓ OTP record exists
✓ OTP not expired
✓ OTP matches (345612)
✓ Attempts < 5

Verification successful:
✓ Finds/creates user
✓ Generates JWT token
✓ Deletes OTP (security)
✓ Returns token + user data
```

**Frontend:**
```
Receives JWT token
Stores in localStorage
Redirects to dashboard
```

### Expected Result
✅ OTP verified
✅ Logged in
✅ Dashboard accessible
✅ Activity logged: OTP_VERIFY_SUCCESS

### How to Verify
```bash
# Check backend console
# Should show:
# ✓ OTP request successful
# ✓ Email sent
# ✓ OTP verified for: user@nic.in
# ✓ OTP_VERIFY_SUCCESS logged
```

---

## 🧪 TEST 3: Parichay SSO (Full Flow)

### Frontend Action
```
1. Open: http://localhost:5173
2. Click "Login" button
3. Sign-In Modal opens
4. Select Role: "Member of Parliament"
5. Select Tab: "Parichay SSO"
```

### Frontend UI
```
Email field: Hidden
Only one button: "Sign In with Parichay"
Click button
```

### What Happens

**Frontend:**
```
1. Calls: authApi.parichaySSO.initiateLogin(redirectUrl)
```

**Backend:**
```
Receives: POST /auth/parichay/initiate
{
  "redirectUrl": "http://localhost:5173/auth/parichay/callback"
}

Backend:
✓ Generates OAuth state
✓ Creates Parichay OAuth URL
✓ Returns authUrl

URL looks like:
https://parichay.gov.in/oauth/authorize?
  client_id=xxx&
  redirect_uri=http://localhost:5173/auth/parichay/callback&
  state=xxx
```

**Frontend:**
```
Receives OAuth URL
Redirects browser to Parichay portal
```

### Expected Result
✅ Redirected to Parichay login page
✅ User logs in at Parichay
✅ Redirected back to MPLADS

### Step 2: Callback Handling

**After Parichay Login:**

**Parichay redirects to:**
```
http://localhost:5173/auth/parichay/callback?
  code=auth_code_xyz&
  state=state_xyz
```

**Frontend:**
```
Handles callback
Calls: authApi.parichaySSO.handleCallback(code, state)
```

**Backend:**
```
Receives: POST /auth/parichay/callback
{
  "code": "auth_code_xyz",
  "state": "state_xyz"
}

Backend:
✓ Validates state
✓ Exchanges code for Parichay token
✓ Gets user info from Parichay
✓ Finds/creates user
✓ Generates MPLADS JWT token
✓ Returns token
```

**Frontend:**
```
Receives JWT token
Stores in localStorage
Redirects to dashboard
```

### Expected Result
✅ Logged in via Parichay
✅ Dashboard accessible
✅ Activity logged: LOGIN_PARICHAY

---

## 🔄 TEST 4: Dashboard Access After Login

### What Should Happen

**After any successful authentication:**

```
1. Token stored in localStorage
2. User redirected to dashboard
3. Topbar shows: User role, name, etc.
4. Sidebar shows: Role-specific menu items
5. Main content loads: Dashboard data

Header shows:
- User: admin.mospi@nic.in
- Role: Ministry
- Last login: [timestamp]

All authenticated API calls include:
Authorization: Bearer <JWT_TOKEN>
```

### Verify Authentication Persists

```bash
# Open browser DevTools
# Application/Storage tab
# LocalStorage
# Should see:
  authToken: eyJhbGciOiJIUzI1NiIs...
  userRole: ministry
  userEmail: admin.mospi@nic.in
```

---

## 🧪 TEST 5: Failed Authentication Scenarios

### Test: Invalid Email

**Frontend:**
```
Email: invalid@gmail.com (not @nic.in)
Passcode: demo_password
Click "Sign In"
```

**Backend Response:**
```json
{
  "success": false,
  "error": "Invalid email format",
  "validationErrors": [
    {
      "loc": ["email"],
      "msg": "Only @nic.in or @gov.in emails allowed"
    }
  ]
}
```

**Frontend:**
```
Shows error: "Only @nic.in or @gov.in emails allowed"
```

✅ Test Result: Error message displayed correctly

### Test: Invalid Password

**Frontend:**
```
Email: admin.mospi@nic.in
Passcode: wrong_password
Click "Sign In"
```

**Backend:**
```
Verifies password
Mismatch detected
Logs failed attempt: LOGIN_FAILED
```

**Backend Response:**
```json
{
  "success": false,
  "error": "Invalid email or password"
}
```

**Frontend:**
```
Shows error: "Invalid email or password"
```

✅ Test Result: Error message displayed correctly

### Test: Invalid Role

**Frontend:**
```
Email: admin.mospi@nic.in
Passcode: demo_password
Role: invalid_role
Click "Sign In"
```

**Backend Response:**
```json
{
  "success": false,
  "error": "Invalid role",
  "validationErrors": [
    {
      "loc": ["role"],
      "msg": "Role must be one of: ministry, mp, district, state_nodal, agency"
    }
  ]
}
```

✅ Test Result: Error message displayed correctly

### Test: Wrong OTP

**Frontend:**
```
OTP request succeeds
User enters wrong OTP (e.g., 000000)
Click "Verify OTP"
```

**Backend:**
```
Verifies OTP
Mismatch detected
Increments attempts: 1/5
```

**Backend Response:**
```json
{
  "success": false,
  "error": "Invalid or expired OTP"
}
```

**Frontend:**
```
Shows error: "Invalid or expired OTP"
Can click "Resend OTP"
```

✅ Test Result: Error handling works correctly

---

## 📊 ACTIVITY LOG VERIFICATION

### Check Backend Logs

After successful logins, backend console should show:

```
✓ GovID Login
  🔐 GovID Login Request: { email, role }
  ✓ GovID login successful for: admin.mospi@nic.in
  📝 Activity logged: LOGIN_SUCCESS

✓ OTP Login
  📱 OTP Request for: user@nic.in
  ✓ OTP sent to: user@nic.in
  ✓ OTP verified for: user@nic.in
  📝 Activity logged: OTP_VERIFY_SUCCESS

✓ Parichay Login
  🆔 Parichay SSO Initiate
  ✓ Parichay auth URL generated
  ✓ Parichay user authenticated
  📝 Activity logged: LOGIN_PARICHAY
```

---

## 🔐 TOKEN VALIDATION TEST

### Test: Use Token for API Calls

**After successful login:**

```bash
# Get token from localStorage
TOKEN=$(your_jwt_token)

# Call protected API
curl -X POST http://localhost:3000/auth/validate \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"token":"'$TOKEN'"}'
```

**Expected Response:**
```json
{
  "success": true,
  "valid": true,
  "user": {
    "id": "user_123",
    "email": "admin.mospi@nic.in",
    "role": "ministry",
    "name": "admin"
  },
  "expiresIn": 86400
}
```

✅ Token is valid and working

### Test: Invalid Token

```bash
# Use invalid token
curl -X POST http://localhost:3000/auth/validate \
  -H "Content-Type: application/json" \
  -d '{"token":"invalid_token_xyz"}'
```

**Expected Response:**
```json
{
  "success": false,
  "valid": false,
  "error": "Invalid or expired token"
}
```

✅ Invalid token correctly rejected

---

## 📋 COMPLETE TEST CHECKLIST

### Frontend Tests
- [ ] Landing page loads
- [ ] Parliament image displays in hero
- [ ] Login button opens modal
- [ ] Role selection works
- [ ] Auth method tabs switch
- [ ] GovID form shows all fields
- [ ] OTP form shows email input
- [ ] Parichay button displays

### GovID Authentication
- [ ] Form validates email
- [ ] Form validates passcode
- [ ] CAPTCHA refreshes
- [ ] "Sign In" button works
- [ ] Success: redirects to dashboard
- [ ] Failure: error message displays
- [ ] Token stored in localStorage

### OTP Authentication
- [ ] "Send OTP" button works
- [ ] Form changes after OTP sent
- [ ] OTP input appears
- [ ] "Verify OTP" button works
- [ ] Wrong OTP shows error
- [ ] Success: redirects to dashboard
- [ ] "Resend OTP" works

### Parichay SSO
- [ ] "Sign In with Parichay" button works
- [ ] Redirects to Parichay (or mock)
- [ ] Callback handled correctly
- [ ] Success: redirects to dashboard

### Backend Tests
- [ ] All 9 endpoints accessible
- [ ] /auth/login-with-role works
- [ ] /auth/otp/request works
- [ ] /auth/otp/verify works
- [ ] /auth/otp/resend works
- [ ] /auth/parichay/initiate works
- [ ] /auth/parichay/callback works
- [ ] /auth/validate works
- [ ] /auth/logout works
- [ ] /auth/roles works

### Security Tests
- [ ] Invalid email rejected
- [ ] Invalid role rejected
- [ ] Wrong password rejected
- [ ] Wrong OTP rejected
- [ ] Expired OTP rejected
- [ ] Invalid token rejected
- [ ] Activity logged

### Data Verification
- [ ] Token in localStorage
- [ ] User info stored
- [ ] Activity logs created
- [ ] OTP records deleted after use

---

## ✅ FINAL VERIFICATION

If all tests pass:

```
✅ Frontend works correctly
✅ Backend receives requests
✅ Backend validates data
✅ Backend returns tokens
✅ Frontend stores tokens
✅ Authentication succeeds
✅ Dashboard loads
✅ Activity logged
✅ Security working
✅ Everything integrated
```

---

## 🚀 YOU'RE READY!

If all these tests pass, your complete MPLADS authentication system is working perfectly!

- ✅ UI sends requests correctly
- ✅ Backend processes them correctly
- ✅ Everything works together
- ✅ Ready for production

**Start testing now!** 🎉

