import api from "../api/axios";


// Accessing backend create account api
export const createAccount = (formData) => {
    return api.post("/users/auth/create-account", formData)
};

// Accessing backend login api
export const login = (formData) => {
    return api.post("/users/auth/login", formData)
};

// Accessing backend verification otp code api
export const verifyUserCreateAccount = (data) => {
    return api.post("users/auth/verify-create-account",  data);
}


