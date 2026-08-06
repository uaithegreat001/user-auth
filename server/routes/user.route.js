import { Router } from "express";
import { authLimiter, createAccountValidator, 
    loginUserValidator, otpValidator } from "../middlewares/security.js";
import { createAccount, verifyUserCreateAccount, login, resendOTPCode } from "../controllers/user.controller.js";

const router = new Router();

// Authentification routes
router.post("/create-account", authLimiter, createAccountValidator, createAccount)
router.post("/login", authLimiter, loginUserValidator, login)
router.post("/verify-create-account", authLimiter, otpValidator, verifyUserCreateAccount )
router.post("/verify-login", authLimiter, otpValidator,)


export default router