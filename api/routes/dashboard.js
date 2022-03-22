const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard');
const loanContractController = require('../controllers/loan-contract');
const jwtAuth = require('../middlewares/auth');

router.use([
    jwtAuth,
]);

router.route('/deposit')
    .get(dashboardController.sumOfDeposit)

router.route('/loan-contract')
    .get(dashboardController.sumOfActiveLoanContract)

router.route('/member')
    .get(dashboardController.sumOfMemberGroup)

router.route('/loan-line-chart')
    .get(loanContractController.lineChart)
    
module.exports = router;
