const express = require('express');
const router = express.Router();
const productCategoryController = require('../controllers/product-category');
const jwtAuth = require('../middlewares/auth');

router.use([
    jwtAuth,
]);

router.route('/')
    .get(productCategoryController.index)
    .post(productCategoryController.create);

router.route('/:productCategoryId')
    .get(productCategoryController.show)
    .patch(productCategoryController.update)
    .delete(productCategoryController.unlink);

module.exports = router;
