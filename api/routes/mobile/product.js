const express = require('express');
const router = express.Router();
const productController = require('../../controllers/mobile/product');
const jwtAuth = require('../../middlewares/auth');

router.use([
    jwtAuth,
]);

router.route('/')
    .get(productController.index)

router.route('/:productId')
    .get(productController.show)

module.exports = router;
