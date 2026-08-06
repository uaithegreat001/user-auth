import mongoose from "mongoose";

// user db schema
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
    },
    isVerified: {
        type: Boolean,
        default: false,
    }
},
    { timestamps: true }
);

// OTP schema
const otpShema = new mongoose.Schema({
    email: {
        type: String,
        lowercase: true,
        required: [true, "Email address is required"],
        trim: true
    },
    otp_code: {
        type: String,
        trim: true,
        required: [true, "OTP code is required"],

    },
    otp_type: {
        type: String,
        required: true,
        enum: ['create_account', 'login', 'reset_password']

    },
    expires_at: {
        type: Date,
        required: true,
        index: { expires: 0 }


    }
},
    { timestamps: true }
);

// One active OTP per email
otpShema.index(
    { email: 1, otp_type: 1 },
    { unique: true }
)

export const User = mongoose.model("User", userSchema);
export const Otp = mongoose.model("Otp", otpShema);


// Database query for data acess
// Creating user data in db
export const createUser = async (userData) => {
    return await User.create(userData);
};

// Find user by email in db
export const findUserByEmail = async (email, includePassword = false) => {
    const query = User.findOne({ email });
    if (includePassword) query.select("+password");
    return await query;
};

// createOtp(otpData)
export const createOtp = async (otpData) => {
    return await Otp.create(otpData)
};

//findOtp(email, otp_type)
export const findOtp = async ({ email, otp_type }) => {
    return await Otp.findOne({ email, otp_type });
}
//deleteOtp(otpId)
export const deleteOtp = async (filter) => {
    return await Otp.deleteOne(filter);
}

// Update the status 
export const markUserVerified = async (email) => {
    return await User.findOneAndUpdate(
        { email },
        { isVerified: true },
        { new: true}
    )


};


