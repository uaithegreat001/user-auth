import { createAccountService, loginUserService, requestPasswordReset} from "../services/user.service.js";
import { 
    resendOtp, 
    verifyOtp, 
    verifyResetPasswordOtp,
    resetPasswordWithToken
} from "../services/otp.service.js";

// Handle user create acoount 
export const createAccount = async (request, response) => {
    try {
        // Parse request
        const { name, email, password } = request.body;

        const user = await createAccountService({ name, email, password });

        return response.status(201).json({
            success: true,
            message: "Check your email OTP code is sent for verification",
            data: user,
        });

    } catch (error) {

        return response.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal server error",
        });


    }
};

// Handle user verification of OTP
export const verifyUserCreateAccount = async (request, response) => {
    try {
        const { email, code } = request.body;

        // Call verify otp in otp service
        await verifyOtp(email, "create_account", code);


        return response.status(200).json({
            success: true,
            message: " Account created successfully"
        });

    } catch (error) {
        return response.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal server error",
        });

    }
};

// handle create account resend otp code
export const resendOtpForCreateAccount = async (request, response) => {
    try {
        // parse request
        const { email } = request.body;
        await resendOtp(email, "create_account");

        return response.status(200).json({
            success: true,
            message: "OTP resent successfully",
        });

    } catch (error) {
        return response.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal server error",
        });
    }
}


// Handle user login 
export const login = async (request, response) => {
    try {
        // Parse request
        const { email, password } = request.body;

        const user = await loginUserService({ email, password });

        return response.status(200).json({
            success: true,
            message: "Check your email OTP code is sent for verification",
            data: user,
        });


    } catch (error) {
        return response.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal server error",
        });

    }
};

// Handle user login verification of otp
export const verifyUserLogin = async (request, response) => {
    try {
        // parse request
        const { email, code } = request.body;
        await verifyOtp(email, "login", code);

        return response.status(200).json({
            success: true,
            message: " Account verify successfully"
        });

    } catch (error) {
        return response.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal server error",
        });

    }
};

// Resend Otp code for login 
export const resendOtpForLogin = async (request, response) => {
    try {
        // parse request
        const { email } = request.body;
        await resendOtp(email, "login");

        return response.status(200).json({
            success: true,
            message: "OTP resent successfully",
        });

    } catch (error) {
        return response.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal server error",
        });
    }
}

// Request for password resetting
export const initiatePasswordReset = async (request, response) => {
    try {
        const { email } = request.body;
        await requestPasswordReset(email);

        return response.status(200).json({
            success: true,
            message: "OTP sent successfully",
        });
    } catch (error) {
        return response.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal server error",
        });
    }
}
// Handle reset password verification of otp
export const verifyOtpForResetPassword = async(request, response) => {
    try {
        const {email, code} = request.body;
        const resetToken = await verifyResetPasswordOtp(email, code);
        return response.status(200).json({
            success: true,
            message: "OTP verified successfully",
            data: {
                resetToken,
            }
        });

    } catch (error) {
        return response.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal server error",
        });
    }
}

// Handle resend otp for resetting password
export const resendOtpForResetPassword = async (request, response) => {
    try {
        const {email} = request.body;
        await resendOtp(email, "reset_password");
        return response.status(200).json({
            success: true,
            message: "OTP resent successfully"

        })
    } catch (error) {
        return response.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal server error",
        })
    }

}

// Password resetting with a token 
export const resetPassword = async (request, response) => {
    try {
        const {token, password} = request.body;
        await resetPasswordWithToken(token, password);
        return response.status(200).json({
            success: true,
            message: " Reset password successfully"
        })

    } catch (error){
        return response.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Reset password failed. please try again"
        })

    }
}


