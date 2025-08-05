const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const checkRole = require('../middleware/roleMiddleware');
const { roleSchema, skillAssignmentSchema, productSchema, skillGroupSchema } = require('../validators/adminValidator');
const { getAllEmployees, updateUserRole, createSkillGroup, assignSkillToEmployee, createProduct, getAllProducts, updateProduct, deleteProduct,getAllSkillGroups} = require('../controllers/adminController');

const validate = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
        const err = new Error(error.details[0].message);
        err.statusCode = 400;
        return next(err);
    }
    next();
};

router.use(verifyToken, checkRole(['admin']));

router.get('/employees', getAllEmployees);
router.patch('/employees/:id/role', validate(roleSchema), updateUserRole);
router.post('/skills', validate(skillGroupSchema), createSkillGroup);
router.post('/skills/assign', validate(skillAssignmentSchema), assignSkillToEmployee);
router.post('/products', validate(productSchema), createProduct);
router.get('/products', getAllProducts);
router.patch('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);
router.get('/skills', getAllSkillGroups);

module.exports = router;