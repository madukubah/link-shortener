const express = require('express');
const router = express.Router();
const saleOrderLineController = require('../../controllers/mobile/sale-orderline');
const jwtAuth = require('../../middlewares/auth');

router.use([
    jwtAuth,
]);

router.route('/')
    .get(saleOrderLineController.index)
    .post(saleOrderLineController.create);

router.route('/:saleOrderLineId')
    .get(saleOrderLineController.show)
    .patch(saleOrderLineController.update)
    .delete(saleOrderLineController.unlink);

module.exports = router;
