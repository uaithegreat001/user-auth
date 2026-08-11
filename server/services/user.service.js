import bcrypt from "bcrypt"
import { createUser,  findUserByEmail } from "../model/user.js";
import { generateOtp } from "./otp.service.js";

// Hash password funtion
const hashPassword = async (password) => {
    return await bcrypt.hash(password, 10);
};  


// Creating new user 
export const createAccountService = async ({ name, email, password }) => {
    let user;

    // Check if user already exist in db
    const existingUser = await findUserByEmail(email);

    // If user exist and is verified
    if (existingUser && existingUser.isVerified) {
        const error = new Error("User already exists");
        error.statusCode = 400;
        throw error;
    }

    // Hash the user password
    const hashedPassword = await hashPassword(password);

    // Send OTP to email
    try {
        await generateOtp(email, "create_account");
    } catch (err) {
        const error = new Error("Connection Error. please try again.");
        error.statusCode = 500;
        throw error;
    }

    // If user exist and is not verified
    if (existingUser && !existingUser.isVerified) {
        existingUser.name = name;
        existingUser.password = hashedPassword;
        user = await existingUser.save();
    } else {

        // Create user
        user = await createUser({
            name,
            email,
            password: hashedPassword,
            isVerified: false
        });

    }
    return {
        id: user._id,
        name: user.name,
        email: user.email,
    }
}


// Login user 
export const loginUserService = async ({ email, password }) => {
    // 1. Check if user already exist in db
    const existingUser = await findUserByEmail(email, true);
    if (!existingUser) {
        const error = new Error("User not exists");
        error.statusCode = 404;
        throw error;
    }

    if (!existingUser.isVerified) {
        const error = new Error("Please verify your account before login");
        error.statusCode = 403;
        throw error;
    }


    // Compare hashed password with provided password
    const isMatch = await bcrypt.compare(password, existingUser.password);

    if (!isMatch) {
        const error = new Error("Invalid email or password");
        error.statusCode = 401;
        throw error;
    }

    // Send OTP to email
    try {
        await generateOtp(email, "login");
    } catch (err) {
        const error = new Error("Connection Error. please try again.");
        error.statusCode = 500;
        throw error;
    }

    return {
        id: existingUser._id,
        email: existingUser.email,
    }

}

// Password resetting
export const requestPasswordReset = async (email) => {
    const existingUser = await findUserByEmail(email);
    if(!existingUser) {
        const error = new Error("User not exist");
        error.statusCode = 404;
        throw error;
    }
    
    if(!existingUser.isVerified) {
        const error = new Error("Please verify your account before reset password");
        error.statusCode = 403;
        throw error;
    }
    // Send OTP to email
    try {
        await generateOtp(email, "reset_password");
    } catch (err) {
        const error = new Error("Connection Error. please try again.");
        error.statusCode = 500;
        throw error;
    }

}

