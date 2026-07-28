import mongoose from "mongoose";


// mangoose db connection configuration
export const connectDB = async () => {
    const conn = await mongoose.connect(process.env.DATABASE_URL);
    console.log(`MongoDB connected: ${conn.connection.host}`);
}