const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard');
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

module.exports = router;
