import bcrypt from "bcrypt"
import { createUser,  findUserByEmail } from "../model/user.js";
import { generateOtp } from "./otp.service.js";

// Hash password funtion
const hashPassword = async (password) => {
    return await bcrypt.hash(password, 10);
};  


// Handle create account service
export const createAccountService = async ({ name, email, password }) => {

    // Check user by email in database
    let user;
    const existingUser = await findUserByEmail(email);

    // If user exist and is verified
    if (existingUser && existingUser.isVerified) {
        const error = new Error("User already exists");
        error.statusCode = 400;
        throw error;
    }

    // Hash the user password
    const hashedPassword = await hashPassword(password);

     // If user exist and is not verified ( allow retry by updating data )
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

    // Send OTP code to email address
    try {
        await generateOtp(email, "create_account");
    } catch (err) {
        const error = new Error("Connection Error. please try again.");
        error.statusCode = 500;
        throw error;
    }

    return {
        id: user._id,
        name: user.name,
        email: user.email,
    }
}


// Handle login service 
export const loginUserService = async ({ email, password }) => {
     // Check user by email in database including password
    const existingUser = await findUserByEmail(email, true);
    // If not found
    if (!existingUser) {
        const error = new Error("Could'nt find user.");
        error.statusCode = 404;
        throw error;
    }
    // If found not verified
    if (!existingUser.isVerified) {
        const error = new Error("Verify your account before login.");
        error.statusCode = 403;
        throw error;
    }

    // If found and is verified
    // Compare hashed password with submitted password
    const isMatch = await bcrypt.compare(password, existingUser.password);

    if (!isMatch) {
        const error = new Error("Email or password is invalid");
        error.statusCode = 401;
        throw error;
    }

    // Send Otp to email
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

// Handle Password resetting
export const requestPasswordReset = async (email) => {
    // Check user by email in database
    const existingUser = await findUserByEmail(email);

    // If not found
    if(!existingUser) {
        const error = new Error("Could'nt find user.");
        error.statusCode = 404;
        throw error;
    }
    
    // If not verified
    if(!existingUser.isVerified) {
        const error = new Error("Please verify your account.");
        error.statusCode = 403;
        throw error;
    }
    // Send Otp code to email
    try {
        await generateOtp(email, "reset_password");
    } catch (err) {
        const error = new Error("Connection Error. please try again.");
        error.statusCode = 500;
        throw error;
    }

}

