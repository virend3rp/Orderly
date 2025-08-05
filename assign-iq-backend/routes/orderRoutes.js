const express = require('express');
const { createOrder,getLatestPreparedOrder } = require('../controllers/orderController');
const { validateBody } = require('../middleware/validationMiddleware');
const { createOrderSchema } = require('../validators/orderValidator');

const router = express.Router();

router.post('/', validateBody(createOrderSchema), createOrder);
router.get('/status/latest-prepared', getLatestPreparedOrder);
module.exports = router;