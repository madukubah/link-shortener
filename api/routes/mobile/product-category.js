const express = require('express');
const router = express.Router();
const productCategoryController = require('../../controllers/mobile/product-category');
const jwtAuth = require('../../middlewares/auth');

router.use([
    jwtAuth,
]);

router.route('/')
    .get(productCategoryController.index)

module.exports = router;
