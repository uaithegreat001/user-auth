import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import { connectDB } from "./configs.js";
import userRouter from "./routes/user.route.js";
import { globalLimiter } from "./middlewares/security.js";


dotenv.config();

const app = express();
const port = process.env.PORT || 3000;


// Global middlewares
app.use(cors({
    origin: "http://localhost:5173",  // Frontend URL
}
));
app.use(helmet());
app.use(express.json());

// Routes
// Global routes with rate limitt to all api endpoints
app.use('/api/v1', globalLimiter);


// Authentificaton routes api endpoint
app.use('/api/v1/users/auth', userRouter);

try {
    await connectDB();
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
} catch (error) {
    console.error(`Failed to connect to the database: ${error.message}`);
    process.exit(1);
}