import mongoose from "mongoose";

// User schema
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
        match: [
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            "Email address is invalid"
        ],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        select: false,
    },
    isVerified: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true }
);

// OTP schema
const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        lowercase: true,
        required: [true, "Email address is required"],
        trim: true
    },
    otpCode: {
        type: String,
        trim: true,
        required: [true, "OTP code is required"],

    },
    otpType: {
        type: String,
        required: true,
        enum: ['create_account', 'login', 'reset_password']

    },
    expiresAt: {
        type: Date,
        required: true,
        expires: 0 


    }
}, { timestamps: true }
);

// One active OTP per email
otpSchema.index(
    { email: 1, otpType: 1 }, { unique: true }
);

// Reset token schema
const resetTokenSchema = new mongoose.Schema({
     email: {
        type: String,
        lowercase: true,
        required: [true, "Email address is required"],
        trim: true
    },
    token: {
        type: String,
        required: true,
        unique: true

    },
    expiresAt: {
        type: Date,
        required: true,
        expires: 0 
    }


}, { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
export const Otp = mongoose.model("Otp", otpSchema);
export const ResetToken = mongoose.model("ResetToken", resetTokenSchema);


// Database query for data acess
// Creating user data in db
export const createUser = async (userData) => {
    return await User.create(userData);
};

// Find user by id and delete
export const deleteUserById = async (id) => {
    return await User.findByIdAndDelete(id);

};

// Find user by email 
export const findUserByEmail = async (email, includePassword = false) => {
    const query = User.findOne({ email });
    if (includePassword) query.select("+password");
    return await query;
};

// Update a user password by email
export const updateUserPassword = async (email, hashedPassword) => {
    return await User.findOneAndUpdate(
        {email},
        {password: hashedPassword},
        {returnDocument: "after"}

    );
}

// Create Otp in db
export const createOtp = async (otpData) => {
    return await Otp.create(otpData)
};

// Find Otp in db
export const findOtp = async ({ email, otpType }) => {
    return await Otp.findOne({ email, otpType });
}
// Delete Otp in db
export const deleteOtp = async (filter) => {
    return await Otp.deleteOne(filter);
}

// Update user status after verification
export const markUserVerified = async (email) => {
    return await User.findOneAndUpdate(
        { email },
        { isVerified: true },
        { returnDocument: "after"}
    )
};

// Create reset token in db
export const createResetToken = async (tokenData) => {
    return await ResetToken.create(tokenData);
};

// Find reset token in db
export const findResetToken = async (token) => {
    return await ResetToken.findOne({token});
};

// Delete reset token in db
export const deleteResetToken = async (token) => {
    return await ResetToken.deleteOne({token});
};

// Delete reset token in db
export const deleteResetTokensByEmail = async (email) => {
    return await ResetToken.deleteMany({email});
}



