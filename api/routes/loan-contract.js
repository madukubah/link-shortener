const express = require('express');
const router = express.Router();
const loanContractController = require('../controllers/loan-contract');
const jwtAuth = require('../middlewares/auth');

router.use([
    jwtAuth,
]);


router.route('/user/:userId')
    .get(loanContractController.getByUserId)

router.route('/:contractId')
    .get(loanContractController.show)
    .patch(loanContractController.update)

router.route('/')
    .get(loanContractController.index)
    .post(loanContractController.create)


module.exports = router;
