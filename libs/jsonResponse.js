/**
 * @desc    Send any success response
 * 
 * @param   {string} message
 * @param   {object | array} data
 */
exports.success = (req, res, message, data) => {
    res.status(200).json({
        success: true,
        message: message,
        data: data
    })
}

/**
 * @desc    Send any error response
 * 
 * @param   {string} message
 * @param   {number} statusCode
 * @param   {object | array} data
 */
exports.error = (req, res, message, statusCode, data = []) => {
    res.status(statusCode).json({
        success: false,
        message: message,
        code: statusCode,
        data: data
    })
}


