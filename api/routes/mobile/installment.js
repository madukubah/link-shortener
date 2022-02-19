const express = require('express');
const router = express.Router();
const installmentController = require('../../controllers/mobile/installment');
const jwtAuth = require('../../middlewares/auth');

router.use([
    jwtAuth,
]);

router.route('/contract/:contractId')
    .get(installmentController.getByContractId)

module.exports = router;
