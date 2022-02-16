const express = require('express');
const router = express.Router();
const authController = require('../../controllers/mobile/auth');
const jwtAuth = require('../../middlewares/auth');

router.route('/signin')
    .post(authController.signIn);

router.route('/reset-password')
    .post([
        jwtAuth 
    ],authController.update);

router.route('/change-pin')
    .post([
        jwtAuth 
    ],authController.update);

module.exports = router;
