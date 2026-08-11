import { Router } from "express";
import {
    authLimiter,
    createAccountValidator,
    emailValidator,
    loginUserValidator,
    otpValidator,
    resetPasswordValidator,
} from "../middlewares/security.js";

import {
    createAccount,
    verifyUserCreateAccount,
    login,
    verifyUserLogin,
    resendOtpForLogin,
    resendOtpForCreateAccount,
    initiatePasswordReset,
    resetPassword,
    resendOtpForResetPassword,
    verifyOtpForResetPassword,

} from "../controllers/user.controller.js";

const router = new Router();

// Authentification routes
router.post("/create-account",
    authLimiter,
    createAccountValidator,
    createAccount
)
router.post("/create-account/verify",
    authLimiter,
    otpValidator,
    verifyUserCreateAccount
)
router.post("/create-account/verify/resend",
    authLimiter,
    emailValidator,
    resendOtpForCreateAccount
)
router.post("/login",
    authLimiter,
    loginUserValidator,
    login
)
router.post("/login/verify",
    authLimiter,
    otpValidator,
    verifyUserLogin
)
router.post("/login/verify/resend",
    authLimiter,
    emailValidator,
    resendOtpForLogin
)
router.post("/forgot-password", 
    authLimiter, 
    emailValidator, 
    initiatePasswordReset
)

router.post("/reset-password/verify", 
    authLimiter, 
    otpValidator, 
    verifyOtpForResetPassword
)

 
router.post("/reset-password/verify/resend", 
    authLimiter, 
    emailValidator, 
    resendOtpForResetPassword
)
router.post("/reset-password", 
    authLimiter, 
    resetPasswordValidator, 
    resetPassword
)
 

export default router