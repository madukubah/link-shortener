const express = require('express');
const router = express.Router();
const cityController = require('../controllers/city');
const jwtAuth = require('../middlewares/auth');

router.use([
    jwtAuth,
]);

router.route('/')
    .get(cityController.index)
    .post(cityController.create);

router.route('/province/:provinceId')
    .get(cityController.getByProvinceId)

router.route('/:cityId')
    .get(cityController.show)
    .patch(cityController.update)
    .delete(cityController.unlink);

module.exports = router;
