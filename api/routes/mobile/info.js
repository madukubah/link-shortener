const express = require('express');
const router = express.Router();
const infoController = require('../../controllers/mobile/info');
const jwtAuth = require('../../middlewares/auth');

router.use([
    jwtAuth,
]);

router.route('/')
    .get(infoController.index)
    .post(infoController.create);

router.route('/:infoId')
    .get(infoController.show)
    .patch(infoController.update)
    .delete(infoController.unlink);

module.exports = router;
