const express = require('express');
const { getAvailableProducts, getAllCategories } = require('../controllers/productController');
const router = express.Router();

router.get('/categories', getAllCategories);

router.get('/', getAvailableProducts);

module.exports = router;