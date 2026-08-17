import bcrypt from "bcrypt"
import { createUser,  findUserByEmail } from "../model/user.js";
import { generateOtp } from "./otp.service.js";
import AppError from "../utils/AppError.js";
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
        throw new AppError("User already exists", 400);
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
        throw new AppError("Connection Error. please try again.", 500);

        
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
        throw new AppError("Could'nt find user.", 404);
    }

    // If found not verified
    if (!existingUser.isVerified) {
        throw new AppError("Verify your account before login..", 403);   
    }

    // If found and is verified
    // Compare hashed password with submitted password
    const isMatch = await bcrypt.compare(password, existingUser.password);

    if (!isMatch) {
        throw new AppError("Email or password is invalid", 401);   
    }

    // Send Otp to email
    try {
        console.time("Sending email start at this time: ");
        await generateOtp(email, "login");
        console.timeEnd("sending email end at this time: ");

    } catch (err) {
        throw new AppError("Connection Error. please try again.", 500);
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
        throw new AppError("Could'nt find user.", 404);   
    }
    
    // If not verified
    if(!existingUser.isVerified) {
        throw new AppError("Please verify your account.", 403);   
    }
    // Send Otp code to email
    try {
        await generateOtp(email, "reset_password");
    } catch (err) {
        throw new AppError("Connection Error. please try again.", 500);
    }

}

