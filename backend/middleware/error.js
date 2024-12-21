const ErrorHandler = require('../utils/errorhandler');

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";

    // Handle Duplicate Entry Error (MySQL-specific, errno: 1062)
    if (err.code === 'ER_DUP_ENTRY') {
        const field = err.sqlMessage.match(/for key '(.+?)'/)?.[1];
        const message = `Duplicate value entered for ${field || 'unknown'} field`;
        err = new ErrorHandler(message, 400);
    }

    // Handle Foreign Key Constraint Errors (MySQL-specific, errno: 1452)
    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
        const message = "Invalid reference to a foreign key";
        err = new ErrorHandler(message, 400);
    }

    // Handle Validation Errors
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(value => value.message).join(', ');
        err = new ErrorHandler(message, 400);
    }

    // Generic Error Response
    res.status(err.statusCode).json({
        success: false,
        message: err.message,
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined, // Hide stack trace in production
    });
};
