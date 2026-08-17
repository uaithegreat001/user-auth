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
    if (!OTP_HASH_SECRET_KEY) {
        throw new AppError("OTP hash key is not configured.", 500);
    }
    return crypto.createHmac('sha256', OTP_HASH_SECRET_KEY).update(code).digest('hex');
};

// Hashing password
const hashPassword = async (password) => {
    return await bcrypt.hash(password, 10);
};


// Handle otp code generating
export const generateOtp = async (email, otpType) => {

    if (!email || !otpType) {
        throw new AppError("Email and OTP are required.", 400);
    }

    // Generate a random 6 digit
    const otpCode = String(crypto.randomInt(0, 10 ** OTP_LENGHTH)).padStart(OTP_LENGHTH, '0');

    // Hash the otp code
    const hashedCode = hashOtpCode(otpCode);

    // Set expiry time to 5min
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
        throw new AppError("Failed to send OTP to email", 502);  
    }

    return { success: true, message: "OTP sent successfully" };
};

// Handle resend otp code 
export const resendOtp = async (email, otpType) => {
    const existingUser = await findUserByEmail(email);
    // Handle create account action
    if (otpType === "create_account") {

        // if Could'nt find user. 
        if (!existingUser) {
        throw new AppError("Could'nt find user. please create account first.", 400);  
        }

        // if user already exist and is verified
        if (existingUser && existingUser.isVerified) {
        throw new AppError("Account already verified. please login.", 400);  
        }
    }

    // Handle create account action 
    if (otpType === "login" || otpType === "reset_password") {

        if (!existingUser) {
        throw new AppError("Could'nt find user. please create account first.", 400);  
        }
        if (!existingUser.isVerified) {
        throw new AppError("Account is unverified. please verify your account.", 400);  
        }
    }

    // Gerate new otp code
    await generateOtp(email, otpType);

    return { success: true, message: "OTP resent successfully" }

}

// Verify otp code submission
export const verifyOtp = async (email, otpType, submittedCode) => {

    if (!email || !otpType || !submittedCode) {
        throw new AppError("Email and OTP are required.", 400);  
    }

    // Find otp in database
    const otpRecord = await findOtp({ email, otpType });
    if (!otpRecord) {
        throw new AppError("Invalid or expired OTP.", 400);  
    }

    // Check if OTP has expired
    const currentTime = Date.now();
    if (currentTime > otpRecord.expiresAt.getTime()) {
        await deleteOtp({ _id: otpRecord._id })
        throw new AppError("OTP has expired.", 400);  

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
        throw new AppError("Verification code is invalid.", 400);  
    }

    // Set verify user to true for create account
    if (otpType === "create_account") {
        const verifiedUser = await markUserVerified(email);
        if (!verifiedUser) {
        throw new AppError("Could'nt find user.", 404);  
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
    await verifyOtp(email, "reset_password", code);

    const resetToken = crypto.randomBytes(32).toString('hex');

    // Delete reset token in database
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
        throw new AppError("Reset token and new password is required.", 400);  
    }

    const currentTime = Date.now();
    const record = await findResetToken(resetToken);
    if (!record || record.expiresAt.getTime() < currentTime) {
        throw new AppError("Invalid  or expired reset session.", 400);  
    }

    const hashedPassword = await hashPassword(newPassword);
    const updatedUser = await updateUserPassword(record.email, hashedPassword);
    if (!updatedUser) {
         AppError("User no longer exists.", 404);  
    }
    await deleteResetToken(resetToken);

}




