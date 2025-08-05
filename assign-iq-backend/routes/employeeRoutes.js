const express = require('express');
const { registerEmployee, loginEmployee, logoutEmployee } = require('../controllers/employeeController');
const verifyToken = require('../middleware/authMiddleware');
const { registerSchema, loginSchema } = require('../validators/authValidator');

// Generic validation middleware
const validate = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
        const err = new Error(error.details[0].message);
        err.statusCode = 400;
        return next(err);
    }
    next();
};

const router = express.Router();

router.post('/register', validate(registerSchema), registerEmployee);
router.post('/login', validate(loginSchema), loginEmployee);
router.post('/logout', verifyToken, logoutEmployee);

module.exports = router;