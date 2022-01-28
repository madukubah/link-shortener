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

router.route('/contract/:contractId')
    .get(installmentController.getByContractId)

router.route('/contract/range-date/:contractId')
    .get(installmentController.getByContractIdRangeDate)

module.exports = router;
