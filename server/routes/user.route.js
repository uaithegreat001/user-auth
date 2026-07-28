import { Router } from "express";
import { authLimiter, createAccountValidator, loginUserValidator } from "../middlewares/security.js";
import { createAccount, login } from "../controllers/user.controller.js";

const router = new Router();

// Authentification routes
router.post("/create-account", authLimiter, createAccountValidator, createAccount)
router.post("/login", authLimiter, loginUserValidator, login)

export default router