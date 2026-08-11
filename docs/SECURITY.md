# Security

Security is enforced across three layers: frontend, middleware, and database to applies defense in-depth in the entire system.

## Frontend Layer
- Input validation for immediate user feedback 

## Middleware Layer
- **helmet:** sets secure HTTP headers
- **cors:** restricts which origins can call the APIs
- **express-rate-limit:**  limits repeated requests to slow brute-force attempts
- **express-validator:**  validates and sanitizes incoming request user data

## Database Layer
- Schema-level validation and sanitization
- Passwords stored as one-way hashes
- OTP code hashing 
