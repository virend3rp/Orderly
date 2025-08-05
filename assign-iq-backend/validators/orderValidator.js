const Joi = require('joi');

const createOrderSchema = Joi.object({
    items: Joi.array().items(
        Joi.object({
            product_id: Joi.number().integer().positive().required(),
            quantity: Joi.number().integer().min(1).required()
        })
    ).min(1).required()
});

module.exports = { createOrderSchema };