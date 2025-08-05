const Joi = require('joi');

const registerSchema = Joi.object({
    full_name: Joi.string().min(3).max(100).required(),
    username: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('staff', 'consolidation', 'admin').optional()
});

const loginSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
});

module.exports = { registerSchema, loginSchema };