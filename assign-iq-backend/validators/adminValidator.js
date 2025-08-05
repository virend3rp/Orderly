const Joi = require('joi');

const roleSchema = Joi.object({
    role: Joi.string().valid('staff', 'consolidation', 'admin').required()
});

const skillAssignmentSchema = Joi.object({
    employee_id: Joi.number().integer().positive().required(),
    group_id: Joi.number().integer().positive().required()
});

const productSchema = Joi.object({
    product_code: Joi.string().min(3).max(50).required(),
    name: Joi.string().min(3).max(255).required(),
    description: Joi.string().optional().allow(''),
    price: Joi.number().positive().required(),
    skill_group_id: Joi.number().integer().positive().required()
});

const skillGroupSchema = Joi.object({
    group_name: Joi.string().min(3).max(100).required()
});

module.exports = { roleSchema, skillAssignmentSchema, productSchema, skillGroupSchema };