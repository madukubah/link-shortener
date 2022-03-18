const express = require('express');
const multer = require('multer');
const router = express.Router();
const pointController = require('../controllers/point');
const jwtAuth = require('../middlewares/auth');


router.use([
    jwtAuth,
]);

router.route('/')
    .get(pointController.index)
    .post(pointController.create);

router.route('/:pointId')
    .get(pointController.show)
    .patch(pointController.update)
    .delete(pointController.unlink);

module.exports = router;
