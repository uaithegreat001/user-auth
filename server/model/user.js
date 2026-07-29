import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
        minLength: [2, "Name must be at least 2 characters"],
        maxLength: [50, "Name must be at most 50 characters"],
        match: [/^[A-Za-z\s]+$/, "Name is invalid"],
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        required: [true, "Email address is required"],
        trim: true,
        match: [
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            "Email address is invalid"
        ],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        trim: true,
        select: false,
    }
}, { timestamps: true });

export const User = mongoose.model("User", userSchema);


// Database query for data acess
// Creating user data in db
export const createUser = async (userData) => {
    return await User.create(userData);
};

// Find user by email in db
export const findUserByEmail = async (email, includePassword = false) => {
    const query = User.findOne({email});
    if(includePassword) query.select("+password");
    return await query;
}


