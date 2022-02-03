const express = require('express');
const router = express.Router();
const installmentController = require('../controllers/installment');
const jwtAuth = require('../middlewares/auth');

router.use([
    jwtAuth,
]);

router.route('/contract/:contractId')
    .get(installmentController.getByContractId)

router.route('/contract/range-date/:contractId')
    .get(installmentController.getByContractIdRangeDate)

router.route('/')
    .get(installmentController.index)
    .post(installmentController.create)

module.exports = router;
