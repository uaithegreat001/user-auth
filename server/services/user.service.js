import bcrypt from "bcrypt"
import {createUser, findUserByEmail} from "../model/user.js";
import { generateOTP } from "./otp.service.js";

// Creating new user 
export const createAccountService = async ({name, email, password}) => {
    // 1. Check if user already exist in db
    const existingUser = await findUserByEmail(email);
    if(existingUser) {
        const error = new Error("User already exists");
        error.statusCode = 400;
        throw error;
    }

    // 2. Hash the user password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 3. Save new user to db
    const newUser = await createUser( {
        name,
        email,
        password : hashedPassword
    })
    // 4. Send OTP to email
    await generateOTP(email, "create_account");

    return {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,

    }

}


// Login user 
export const loginUserService = async ({email, password}) => {
    // 1. Check if user already exist in db
    const existingUser = await findUserByEmail(email, true);
    if(!existingUser) {
        const error = new Error("User not exists");
        error.statusCode = 404;
        throw error;
    }

    if(!existingUser.isVerified) {
        const error = new Error("Verify your email address before logging in");
        error.statusCode = 403;
        throw error;
    }


    // Compare hashed password with provided password
    const isMatch = await bcrypt.compare(password, existingUser.password);

    if(!isMatch) {
        const error = new Error("Invalid email or password");
        error.statusCode = 401;
        throw error;
    }

     return {
        id: existingUser._id,
        email: existingUser.email,
    }

}
