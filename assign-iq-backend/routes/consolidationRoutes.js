const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const checkRole = require('../middleware/roleMiddleware');
const { validateParams } = require('../middleware/validationMiddleware');
const { idParamSchema } = require('../validators/consolidationValidator');
const { getWipOrders, markOrderAsComplete } = require('../controllers/consolidationController');

const allowedRoles = ['consolidation', 'admin'];

router.get('/orders', verifyToken, checkRole(allowedRoles), getWipOrders);
router.patch('/orders/:id/complete', verifyToken, checkRole(allowedRoles), validateParams(idParamSchema), markOrderAsComplete);

module.exports = router;