const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');

router.route('/:userId')
    .patch(userController.update)

router.route('/send-email-reset')
    .post(userController.sendResetPassword)

router.route('/reset-password')
    .post(userController.resetPassword)

module.exports = router;
