# Changelog
All changes to this project will be documented in this file

## 2026-08-11
### Added
- OTP generation endpoint for login & reset password 
- Resend OTP cede endpoint for login & reset password
- OTP code verification endpoints

## 2026-08-10
### Added
- Resend OTP cede endpoint for create accout 
### Fixed
- Fixing user save to database when unstable network and returning of user not exist when network stable


## 2026-08-06
### Added
- OTP generation flow for users during creating account.
- OTP code verification endpoint to complete the account creation.

## 026-07-30
### Fixed
- Resolved missing words and typo error in backend error responses.

## 2026-07-29
### Added
- Account creation (`/create-account`) and login (`/login`) API endpoints with password hashing.
- Input validation and sanitization middleware for incoming backend requests.
- Database-level schema validation as a second layer of defense.
- Frontend account creation and login pages built with React.js and vanilla CSS.
- Full API integration connecting React forms to backend endpoints using Axios.


