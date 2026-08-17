import api from "../api/axios";


// Accessing backend create account api
export const createAccount = (data) => {
    return api.post("/users/auth/create-account", data)
};

// Verify verification code for create
export const verifyCreateAccount = (data) => {
    return api.post("users/auth/create-account/verify",  data);
}

// Resending verification code for create account
export const resendCodeTOCreateAccount = (data) => {
    return api.post("users/auth/create-account/verify/resend",  data);
}

// Accessing backend login api
export const login = (data) => {
    return api.post("/users/auth/login", data)
};

// Resending verification code for login 
export const verifyLogin = (data) => {
    return api.post("/users/auth/login/verify",  data);
}  

// Resending verification code for login 
export const resendCodeTOLogin = (data) => {
    return api.post("users/auth/login/verify/resend",  data);
}

// Forgot password 
export const forgotPassword = (data) => {
    return api.post("users/auth/forgot-password", data);
}

// Verify verification code for reset password 
export const verifyResetPassword = (data) => {
    return api.post("users/auth/reset-password/verify", data);
}

// Resending verification code for reset password
export const resendCodeTOResetPassword = (data) => {
    return api.post("users/auth/reset-password/verify/resend", data);
}

// Reset password
export const resetPassword = (data) => {
    return api.post("users/auth/reset-password", data);
}



