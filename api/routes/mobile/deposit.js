const express = require('express');
const multer = require('multer');
const router = express.Router();
const depositController = require('../../controllers/mobile/deposit');
const jwtAuth = require('../../middlewares/auth');

router.use([
    jwtAuth,
]);

router.route('/')
    .get(depositController.getByUserId)

module.exports = router;
