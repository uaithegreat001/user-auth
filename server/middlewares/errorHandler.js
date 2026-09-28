import logger from "../utils/logger.js";

const errorHandler = (error, request, response, next) => {

    const statusCode = error.statusCode || 500;
    const message = error.isOperational ? error.message : "Internal server error";

    // Log any error
    logger.error( error.message, {
        method: request.method,
        url: request.originalUrl,
        statusCode,
        stack: error.stack
    });

    // Response
    return response.status(statusCode).json({
        success: false,
        message,
    }); 

}
export default errorHandler;