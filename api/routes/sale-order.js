const express = require('express');
const router = express.Router();
const saleOrderController = require('../controllers/sale-order');
const jwtAuth = require('../middlewares/auth');

router.use([
    jwtAuth,
]);

router.route('/')
    .get(saleOrderController.index)
    // .post(saleOrderController.create);

router.route('/:saleOrderId')
    .get(saleOrderController.show)
    .patch(saleOrderController.update)
    // .delete(saleOrderController.unlink);

module.exports = router;
