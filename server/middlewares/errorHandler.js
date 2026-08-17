const errorHandler = (error, request, response, next) => {

    const statusCode = error.statusCode || 500;
    const message = error.isOperational ? error.message : "Internal server error";

    // Log any error
    console.error(`[Error: ] ${request.method} ${request.originalUrl}`, {
        message: error.message,
        statusCode,
        stack: error.stack,
        timestamp: new Date().toISOString() 
    });

    // Response
    return response.status(statusCode).json({
        success: false,
        message,
    }); 

}
export default errorHandler;