import jwt from 'jsonwebtoken';
import AppError from './AppError.js'


const getSecretKey = () => {
    // Secret key
    const secretKey = process.env.JWT_SECRET_KEY;
    if (!secretKey) {
        throw new AppError("Can't access JWT secret key", 500);
    }
    return secretKey;
}

// Generate jw token
export const generateAccessToken = (userId) => {
    return jwt.sign(
        // Payload
        { id: userId },
        getSecretKey(),
        { expiresIn: "15m" }
    );
}

// Verify jw token
export const verifyAccessToken = (token) => {
    try {
        return jwt.verify(token, getSecretKey());
    } catch (error) {
        return null;
    }
}

// Generate refresh token
export const generateRefreshJwToken = (userId) => {
    return jwt.sign(
        {id: userId},   
        getSecretKey(),
        {expiresIn: "7d"}
    )
}

// Verify refresh jw token
export const verifyRefreshJwToken = (token) => {
    try {
        return jwt.verify(token, getSecretKey())
        
    } catch (error) {
        return null;
    }

}