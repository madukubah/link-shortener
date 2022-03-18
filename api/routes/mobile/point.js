const express = require('express');
const multer = require('multer');
const router = express.Router();
const pointController = require('../../controllers/mobile/point');
const jwtAuth = require('../../middlewares/auth');

router.use([
    jwtAuth,
]);

router.route('/balance')
    .get(pointController.sumOfPoint)

module.exports = router;
