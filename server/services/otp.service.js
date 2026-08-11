// const crypto = require('crypto');
import bcrypt from 'bcrypt';
import crypto, { timingSafeEqual } from 'crypto';
import {
    createOtp,
    findOtp,
    deleteOtp,
    markUserVerified,
    findUserByEmail,
    createResetToken,
    findResetToken,
    deleteResetToken,
    updateUserPassword,
    deleteResetTokensByEmail

} from '../model/user.js';
import 'dotenv/config';
import { transporter } from './email.service.js';

const OTP_LENGHTH = 6;
const OTP_EXPIRY_TIME = 5;

// Otp code hashing
const OTP_HASH_SECRET_KEY = process.env.OTP_HASH_SECRET_KEY;
const hashOtpCode = (code) => {
    if (!OTP_HASH_SECRECT_KEY) {
        throw new Error("OTP hash key is not configured")
    }
    return crypto.createHmac('sha256', OTP_HASH_SECRET_KEY).update(code).digest('hex');

}

// Hashing password
const hashPassword = async (password) => {
    return await bcrypt.hash(password, 10);
}


// Handle otp code generating
export const generateOtp = async (email, otpType) => {

    if (!email || !otpType) {
        const error = new Error("Email and OTP are required");
        error.statusCode = 400;
        throw error;
    }

    // Generate a random 6 digit
    const otpCode = String(crypto.randomInt(0, 10 ** OTP_LENGHTH)).padStart(OTP_LENGHTH, '0');

    // Hash the otp code
    const hashedCode = hashOtpCode(otpCode);

    // Set expiry time 
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_TIME * 60 * 1000);

    // Delete any existing OTP for this email 
    await deleteOtp({ email, otpType });

    // Save to database
    await createOtp({
        otpCode: hashedCode,
        email,
        otpType,
        expiresAt: expiresAt
    });

    // Send the code via email
    try {
        await transporter.sendMail({
            from: process.env.SMTP_USERNAME,
            to: email,
            subject: "Your verification code",
            text: `Your Verification code is ${otpCode} and it will expire at ${expiresAt}`
        });

    } catch (err) {
        console.error("Error while sending mail:", err);
        throw new Error("Failed to send OTP to email")
    }
    
    return { success: true, message: 'OTP sent successfully' }


}

// Handle resend otp code 
export const resendOtp = async (email, otpType) => {
    const existingUser = await findUserByEmail(email);
    // Handle create account action
    if (otpType === "create_account") {

        // if user not exist 
        if (!existingUser) {
            const error = new Error("User not exist. please create account first");
            error.statusCode = 400;
            throw error;
        }
        // if user already exist and is verified
        if (existingUser && existingUser.isVerified) {
            const error = new Error("Account already verified. please login");
            error.statusCode = 400;
            throw error;
        }
    }
    // Handle create account action 
    if (otpType === "login" || otpType === "reset_password") {

        if (!existingUser) {
            const error = new Error("User not exist. please create account first");
            error.statusCode = 400;
            throw error;
        }
        if (!existingUser.isVerified) {
            const error = new Error("Account is unverified. please verify your account");
            error.statusCode = 400;
            throw error;
        }
    }

    // Gerate new otp code
    await generateOTP(email, otpType);

    return { success: true, message: 'OTP resent successfully' }

}

// Verify otp code submission
export const verifyOtp = async (email, otpType, submittedCode) => {

    if (!email || !otpType || !submittedCode) {
        const error = new Error("Email and OTP are required");
        error.statusCode = 400;
        throw error;
    }

    // Find otp in database
    const otpRecord = await findOtp({ email, otpType });
    if (!otpRecord) {
        const error = new Error("Invalid or expired OTP");
        error.statusCode = 400;
        throw error;

    }

    // Check if OTP has expired
    const currentTime = Date.now();
    if (currentTime > otpRecord.expiresAt.getTime()) {
        await deleteOtp({ _id: otpRecord._id })
        const error = new Error("OTP has expired");
        error.statusCode = 400;
        throw error;
    }
    // Hash otp code 
    const submitted = String(submittedCode).padStart(OTP_LENGHTH, '0');
    const HashedSubmitted = hashOtpCode(submitted);

    // Compare the code 
    const submittedBuffer = Buffer.from(HashedSubmitted);
    const storedBuffer = Buffer.from(otpRecord.otpCode);

    const matchOtp = submittedBuffer.length === storedBuffer.length
        && timingSafeEqual(submittedBuffer, storedBuffer);

    if (!matchOtp) {
        const error = new Error("Invalid OTP code");
        error.statusCode = 400;
        throw error;
    }

    // Set verify user to true for create account
    if (otpType === "create_account") {
        const verifiedUser = await markUserVerified(email);
        if (!verifiedUser) {
            const error = new Error("User not exists")
            error.statusCode = 404;
            throw error;
        }
    }

    // Delete the OTP
    await deleteOtp({ _id: otpRecord._id })
    return {
        success: true,
        message: "OTP verified successfully"
    };

};

// Handle reset password code verification
export const verifyResetPasswordOtp = async (email, code) => {
    // Verify otp code
    await verifyOTP(email, "reset_password", code);

    const resetToken = crypto.randomBytes(32).toString('hex');
    
    // Delete reset token in db
    await deleteResetTokensByEmail(email);
    
    // Create reset token
    await createResetToken({
        email,
        token: resetToken,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minute 

    });
    return resetToken;
}

// Handle reset password with reset token and new password
export const resetPasswordWithToken = async (resetToken, newPassword) => {
    // if no token and password throw error
    if (!resetToken || !newPassword) {
        const error = new Error("Reset token and new password is required");
        error.statusCode = 400;
        throw error;
    }

    const currentTime = Date.now();
    const record = await findResetToken(resetToken);
    if (!record || record.expiresAt.getTime() < currentTime) {
        const error = new Error("Invalid  or expired reset session");
        error.statusCode = 400;
        throw error;
    }

    const hashedPassword = await hashPassword(newPassword);
    const updatedUser = await updateUserPassword(record.email, hashedPassword);
    if (!updatedUser) {
        const error = new Error("User no longer exists");
        error.statusCode = 404;
        throw error;
    }
    await deleteResetToken(resetToken);

}




