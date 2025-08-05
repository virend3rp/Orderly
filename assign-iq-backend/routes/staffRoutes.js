const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const checkRole = require('../middleware/roleMiddleware');
const { validateParams } = require('../middleware/validationMiddleware');
const { idParamSchema } = require('../validators/staffValidator');
const { getMyQueue, markItemAsPrepared } = require('../controllers/staffController');

const allowedRoles = ['staff', 'admin'];

router.get('/queue', verifyToken, checkRole(allowedRoles), getMyQueue);
router.patch('/items/:id/prepare', verifyToken, checkRole(allowedRoles), validateParams(idParamSchema), markItemAsPrepared);

module.exports = router;