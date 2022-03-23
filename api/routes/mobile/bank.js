const express = require('express');
const router = express.Router();
const bankController = require('../../controllers/mobile/bank');
const jwtAuth = require('../../middlewares/auth');

router.use([
    jwtAuth,
]);

router.route('/')
    .get(bankController.index)
    .post(bankController.create);

router.route('/:bankId')
    .get(bankController.show)
    .patch(bankController.update)
    .delete(bankController.unlink);

module.exports = router;
