# Architecture

### Backend ( Layered Architecture )
```
presentation Layer [route, middleware, controller]
             | 
business logic layer [ service ]
             |
database layer [ repo, model]
```
- **Routes:** define API endpoints
- **Middleware:** handle security verification
- **Controllers:** handle request/response
- **Services:** contain business logic 
- **Model:** database access and schema

## Frontend ( Component-Based Design )
The UI is broken into small, reusable React components rather than large monolithic pages.

## Pseudocode
### 1. Create Account
```
1. Receive request (name, email, password)
2. Check user by email in database
   - If user exists AND is verified → throw error ("User already exists")
   - If user exists AND is NOT verified → update name/password (allow retry)
3. Hash the password
4. Generate 6-digit OTP code
5. Hash OTP with HMAC-SHA256, 
6. Save OTP to database with 5-min expiry
7. Send OTP to user's email
8. Save user to database with isVerified = false
9. Respond with success + user data (id, name, email)

```

### 2. Login
```
1. Receive request (email, password)
2. Check user by email in database (include password field)
   - If not found → throw error ("Could'nt find user")
   - If found but NOT verified → throw error ("Verify your account before login.")
   - If found and verified →
       Compare submitted password with hashed password
       - If not match → throw error ("Email or password is invalid")
       - If matches →
           a. Generate 6-digit OTP code
           b. Hash OTP 
           c. Save to database with 5-min expiry
           d. Send OTP to user's email
           e. Respond with success + user data (id, email)
              

```

### 3. Reset Password 
```
3a. Initiate Reset
1. Receive request (email)
2. Check user by email in database
   - If not found → throw error ("Could'nt find user.")
   - If not verified → throw error ("Verify your account")
3. Generate 6-digit OTP code 
4. Hash OTP 
5. Save to database
7. Send OTP to user's email
8. Respond with success


3b. Verify Reset OTP
1. Receive request (email, code)
2. Call verify OTP 
3. Generate a random reset token (32 bytes hex)
4. Delete any old reset tokens for this email
5. Save new reset token in database with 10-min expiry
6. Respond with success + resetToken
   

3c. Reset Password
1. Receive request (token, newPassword)
2. Find reset token in database
   - If not found or expired → throw error ("Invalid or expired reset session")
3. Hash the new password
4. Update user's password in database
5. Delete the reset token
6. Respond with success

