const express = require('express');
const router = express.Router();
const loanContractController = require('../../controllers/mobile/loan-contract');
const jwtAuth = require('../../middlewares/auth');

router.use([
    jwtAuth,
]);

router.route('/')
    .get(loanContractController.getByUserId)
    .post(loanContractController.create)

router.route('/:contractId')
    .get(loanContractController.show)


module.exports = router;
