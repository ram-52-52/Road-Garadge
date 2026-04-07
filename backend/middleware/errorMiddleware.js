/**
 * @desc Centralized Error Handler Middleware
 */
const errorHandler = (err, req, res, next) => {
    console.error('❌ Critical Error Trace:', err.stack);

    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    
    res.status(statusCode).json({
        success: false,
        message: err.message || 'Inter-dimensional Server Error',
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
};

module.exports = { errorHandler };
