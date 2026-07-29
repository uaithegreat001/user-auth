import { createAccountService, loginUserService } from "../services/user.service.js";

// Handle create acoount request and response
export const createAccount = async (request, response) => {
    try {
        // Parse user request
        const { name, email, password } = request.body;

        // Call createAccount service from user.service.js
        const user = await createAccountService({ name, email, password });

        // Send sucess response 
        return response.status(201).json({
            success: true,
            message: "Account created successful",
            data: user,
        });

    } catch (error) {
        // Handle response error
        return response.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal server error",
        })


    }
};

// Handle login request and response
export const login = async (request, response) => {
    try {
        // Parse user request
        const { email, password } = request.body;
        
        // Call loginUserService from user.service.js
        const user = await loginUserService({ email, password });

        // Send sucess response 
        return response.status(200).json({
            success: true,
            message: "Login successful",
            data: user,
        });


    } catch (error) {
        // Handle response error
        return response.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal server error",
        })

    }
};
