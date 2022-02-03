const express = require('express');
const router = express.Router();
const provinceController = require('../controllers/province');
const jwtAuth = require('../middlewares/auth');

router.use([
    jwtAuth,
]);

router.route('/')
    .get(provinceController.index)
    .post(provinceController.create);

router.route('/:provinceId')
    .get(provinceController.show)
    .patch(provinceController.update)
    .delete(provinceController.unlink);

module.exports = router;
