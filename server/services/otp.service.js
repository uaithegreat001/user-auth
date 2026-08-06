// const crypto = require('crypto');
import crypto, { timingSafeEqual } from 'crypto';
import { createOtp, findOtp, deleteOtp, markUserVerified} from '../model/user.js';
import 'dotenv/config';
import { transporter } from './email.service.js';
import { error } from 'console';

const OTP_LENGHT = 6;
const OTP_EXPIRY_TIME = 5;

// Otp code hashing
const OTP_HASH_SECRECT_KEY = process.env.OTP_HASH_SECRECT_KEY;

const hashOtpCode = (code) => {
    if (!OTP_HASH_SECRECT_KEY) {
        throw new Error("OTP hash key is not configured")
    }
    return crypto.createHmac('sha256', OTP_HASH_SECRECT_KEY).update(code).digest('hex');

}

// Generate otp code
export const generateOTP = async (email, otp_type) => {

    if (!email || !otp_type) {
        const error = new Error("Email and OTP are required");
        error.statusCode = 400;
        throw error;
    }

    // generate a random 6 digit
    const otpCode = String(crypto.randomInt(0, 10 ** OTP_LENGHT)).padStart(OTP_LENGHT, '0');

    // Hash the otp code
    const hashedCode = hashOtpCode(otpCode);

    //Set expiry time 
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_TIME * 60 * 1000);

    // Delete any existing OTP for this email 
    await deleteOtp({email, otp_type});

    // Save to database
    await createOtp({
        otp_code: hashedCode,
        email,
        otp_type,
        expires_at: expiresAt
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
        throw new Error("Unable to send OTP to email")
    }
5
    //Return success
    return {success: true, message: 'OTP sent successfully'}


}

export const verifyOTP = async (email, otp_type, submittedCode) => {

    if (!email || !otp_type || !submittedCode) {
        const error = new Error("Email and OTP are required");
        error.statusCode = 400;
        throw error;
    }

    // find otp in database
    const otpRecord = await findOtp({email, otp_type});
    if (!otpRecord) {
        const error = new Error("Invalid or expired OTP");
        error.statusCode = 400;
        throw error;

    }

    // Check if OTP has expired
    const currentTime = Date.now();
    if (currentTime > otpRecord.expires_at.getTime()) {
        await deleteOtp({ _id: otpRecord._id })
        const error = new Error("OTP has expired");
        error.statusCode = 400;
        throw error;
    }
    // hash otp code 
    const submitted = String(submittedCode).padStart(OTP_LENGHT, '0');
    const HashedSubmitted = hashOtpCode(submitted);

    // Compare the code 
    const submittedBuffer = Buffer.from(HashedSubmitted);
    const storedBuffer = Buffer.from(otpRecord.otp_code);

    const matchOtp = submittedBuffer.length === storedBuffer.length
        && timingSafeEqual(submittedBuffer, storedBuffer);

    if (!matchOtp) {
        const error = new Error("Invalid OTP code");
        error.statusCode = 400;
        throw error;
    }
    
    const verifiedUser = await markUserVerified(email);
    if(!verifiedUser) {
        const error = new Error ("User not exists")
        error.statusCode = 404;
        throw error;
    }


    // Delete the OTP
    await deleteOtp({ _id: otpRecord._id })
    return {
        success: true,
        message: "OTP verified successfully"
    };

};
