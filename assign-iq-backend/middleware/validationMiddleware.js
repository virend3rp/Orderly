/**
 * Generic middleware to validate request bodies against a Joi schema.
 */
const validateBody = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
        const err = new Error(error.details[0].message);
        err.statusCode = 400; // Bad Request
        return next(err);
    }
    next();
};

/**
 * Generic middleware to validate URL parameters against a Joi schema.
 */
const validateParams = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.params);
    if (error) {
        const err = new Error(error.details[0].message);
        err.statusCode = 400; // Bad Request
        return next(err);
    }
    next();
};


module.exports = {
    validateBody,
    validateParams,
};