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
1. Receive request ( name, email, password )
2. Check user by email in database
   - If yes → throw error ("User already exists")
   - If no →
       a. Hash the password
       b. Save user data to the database
       c. Respond with success message ("Account Created successiful")
       d. Redirect to dashboard
```

### 2. Login
```
1. Receive request (email, password)
2. Check user by email in database
   - If not found → throw error ("User not exists")
   - If found →
       Compare submitted password with hashed password in database
       - If not match → throw error ("Invalid credentials")
       - If matches →
           a. Respond with success message ("Login successiful")
           b. Redirect to dashboard
```

### 3. Reset Password *(coming)*
