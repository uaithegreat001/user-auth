### Validation on both frontend and backend
Frontend validation is for user experience (instant feedback). Backend validation is for security (frontend checks can be bypassed, backend involve more stricker to bypass).

### JW Token for session
Access and Refresh session token is save in cookies because is more secure than storing in local storage.

### Navigation back to login
After the user successfully resets their password, they are routed back to the login page to ensure a secure security update and a seamless user experience.
```
Version 1
Forgot password page ---> OTP page ---> Reset password page -->  Dashboard

Version 2 
Forgot password page ---> OTP page ---> Reset password page --> Login page ---> OTP page --> Dashboard

Version 3
Forgot password page ---> OTP page ---> Reset password page --> Login page ---> Dashboard
```