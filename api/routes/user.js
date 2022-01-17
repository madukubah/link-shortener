const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');

router.route('/:userId')
    .patch(userController.update)

module.exports = router;
