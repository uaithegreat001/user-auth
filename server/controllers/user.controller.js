import { createAccountService, loginUserService, requestPasswordReset } from "../services/user.service.js";
import {
    resendOtp,
    verifyOtp,
    verifyResetPasswordOtp,
    resetPasswordWithToken
} from "../services/otp.service.js";
import { generateAccessToken, generateRefreshJwToken } from "../utils/jwt.js";
import {setCookies, setRefreshCookies} from "../utils/cookies.js";
import { refreshJwTokenService } from "../services/token.service.js";

// Handle create account
export const createAccount = async (request, response, next) => {
    try {
        // Parse request
        const { name, email, password } = request.body;

        const user = await createAccountService({ name, email, password });

        // Response & return user data
        return response.status(201).json({
            success: true,
            message: "Check your email OTP code is sent for verification",
            data: user,
        });

    } catch (error) {
        next(error);
    }
};

// Handle user verification of OTP
export const verifyUserCreateAccount = async (request, response, next) => {
    try {
        const { email, code } = request.body;

        // Service verifies OTP, marks user verified, and returns the user
        const user = await verifyOtp(email, "create_account", code);

        // Access jwt assign
        const token = generateAccessToken(user._id);
        response.cookie("auth_token", token, setCookies);

        // Refresh jwt assign
        const refreshJwToken = generateRefreshJwToken(user._id);
        await refreshJwTokenService(user._id, refreshJwToken);
        response.cookie("refresh_token", refreshJwToken, setRefreshCookies);

        return response.status(200).json({
            success: true,
            message: "Account created successfully",
            user: { id: user._id, name: user.name, email: user.email, refreshJwToken }
        });

    } catch (error) {
        next(error);
    }
};

// handle create account resend otp code
export const resendOtpForCreateAccount = async (request, response, next) => {
    try {
        // Parse request
        const { email } = request.body;
        await resendOtp(email, "create_account");

        return response.status(200).json({
            success: true,
            message: "OTP resent successfully",
        });

    } catch (error) {
        next(error);
    }
}


// Handle user login 
export const login = async (request, response, next) => {
    try {
        // Parse request
        const { email, password } = request.body;

        const user = await loginUserService({ email, password });

        // Response & return user data
        return response.status(200).json({
            success: true,
            message: "Check your email OTP code is sent for verification",
            data: user,
        });


    } catch (error) {
        next(error);
    }
};

// Handle user login verification of otp
export const verifyUserLogin = async (request, response, next) => {
    try {
        // parse request
        const { email, code } = request.body;

        // Service verifies OTP and returns the user
        const user = await verifyOtp(email, "login", code);

        // Jwt assign
        const token = generateAccessToken(user._id);
        // Set token in cookie
        response.cookie("auth_token", token, setCookies);
        
         // Refresh jwt assign
        const refreshJwToken = generateRefreshJwToken(user._id);
        await refreshJwTokenService(user._id, refreshJwToken);
        response.cookie("refresh_token", refreshJwToken, setRefreshCookies);

        return response.status(200).json({
            success: true,
            message: "Login successfully",
            user: { id: user._id, name: user.name, email: user.email }
        });

    } catch (error) {
        next(error);
    }
};

// Resend Otp code for login 
export const resendOtpForLogin = async (request, response, next) => {
    try {
        // parse request
        const { email } = request.body;
        await resendOtp(email, "login");

        return response.status(200).json({
            success: true,
            message: "OTP resent successfully",
        });

    } catch (error) {
        next(error);
    }
}

// Initiate password resetting
export const initiatePasswordReset = async (request, response, next) => {
    try {
        // Parse request
        const { email } = request.body;
        await requestPasswordReset(email);

        return response.status(200).json({
            success: true,
            message: "Check your email OTP code is sent for verification",
        });
    } catch (error) {
        next(error);
    }
}
// Handle reset password verification of otp
export const verifyOtpForResetPassword = async (request, response, next) => {
    try {
        const { email, code } = request.body;
        const resetToken = await verifyResetPasswordOtp(email, code);
        return response.status(200).json({
            success: true,
            message: "OTP verified successfully",
            data: {
                resetToken,
            }
        });

    } catch (error) {
        next(error);
    }
}

// Handle resend otp for resetting password
export const resendOtpForResetPassword = async (request, response, next) => {
    try {
        const { email } = request.body;
        await resendOtp(email, "reset_password");
        return response.status(200).json({
            success: true,
            message: "OTP resent successfully"

        })
    } catch (error) {
        next(error);
    }

}

// Handle password resetting with a token 
export const resetPassword = async (request, response, next) => {
    try {
        const { token, password } = request.body;
        await resetPasswordWithToken(token, password);
        return response.status(200).json({
            success: true,
            message: " Reset password successfully"
        })

    } catch (error) {
        next(error);
    }
}


