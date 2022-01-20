const express = require('express');
const router = express.Router();
const installmentController = require('../controllers/installment');
const jwtAuth = require('../middlewares/auth');

router.use([
    jwtAuth,
]);

router.route('/')
    .get(installmentController.index)
    .post(installmentController.create)

router.route('/:contractId')
    .get(installmentController.getByContractId)

module.exports = router;
