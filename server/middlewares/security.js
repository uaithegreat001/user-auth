import ratelimit from "express-rate-limit"
import { body, validationResult } from "express-validator"


// Global rate limit of every api endpoints
export const globalLimiter = ratelimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 50,   // 50 request per ip per 5 minutes
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many requests, please try again later",
    },
})

// Rate limit for authentication api endpoints (login, register, forgot password)
export const authLimiter = ratelimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 12,   // 12 request per ip per 5 minutes
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many requests, please try again later",
    },
})

// Express validator and sanitizer middleware
// Validation errors handling middleware 
export const handleValidationErrors = (request, response, next) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(400).json({
            success: false,
            message: "User Validation failed",
            errors: errors.array().map((error) => ({
                field: error.path,
                message: error.msg
            }))
        })
    }
    next();
};

// Validation rules for create account
export const createAccountValidator = [

    // Name validation and sanitization
    body("name").trim().notEmpty().withMessage("Name is required").bail()
        .isLength({ min: 2 }).withMessage("Name must be at least 2 characters").bail()
        .isLength({ max: 50 }).withMessage("Name must be at most 50 characters").bail()
        .matches(/^[A-Za-z\s]+$/).withMessage("Name is invalid"),

    // Email validation and sanitization
    body("email").trim().notEmpty().withMessage("Email address is required").bail()
        .isEmail().withMessage("Email address is invalid").bail()
        .normalizeEmail(),

    // Password validation and sanitization
    body("password").notEmpty().withMessage("Password is required").bail()
        .isLength({ min: 8 }).withMessage("Password must be 8+ characters").bail()
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
        .withMessage("Password must be 8+ characters with lowercase, uppercase, number and symbol"),

    handleValidationErrors
];

// Validation rules for login
export const loginUserValidator = [

    // Email validation and sanitization
    body("email").trim().notEmpty().withMessage("Email address is required").bail()
        .isEmail().withMessage("Email address is invalid").bail()
        .normalizeEmail(),

    // Password validation and sanitization
    body("password").notEmpty().withMessage("Password is required"),


    handleValidationErrors

];

// Validation rules for otp
export const otpValidator = [

    // Email validation
    body("email").trim().notEmpty().withMessage("Email address is required").bail()
        .isEmail().withMessage("Email address is invalid").bail()
        .normalizeEmail(),

    // Otp code validation and sanitization
    body("code").trim().notEmpty().withMessage("OTP code is required").bail()
        .matches(/^\d{6}$/).withMessage("OTP code is invalid"),

    handleValidationErrors


];

// Validate rule for email
export const emailValidator = [
    // Email validation
    body("email").trim().notEmpty().withMessage("Email address is required").bail()
        .isEmail().withMessage("Email address is invalid").bail()
        .normalizeEmail(),

    handleValidationErrors

];

// Validate rules for Otp code and reset token 
export const resetPasswordValidator = [
    // Reset password token
    body("token")
        .trim()
        .notEmpty().withMessage("Reset token is required"),

    // Password validation and sanitization
    body("password").notEmpty().withMessage("Password is required").bail()
        .isLength({ min: 8 }).withMessage("Password must be 8+ characters").bail()
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
        .withMessage("Password must be 8+ characters with lowercase, uppercase, number and symbol"),

    handleValidationErrors
];




