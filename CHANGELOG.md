# Changelog
All changes to this project will be documented in this file


## 2026-08-06
### Added
- OTP generation flow for users during creating account.
- OTP code verification endpoint to complete the account creation flow.

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


