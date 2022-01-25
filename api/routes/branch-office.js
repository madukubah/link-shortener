const express = require('express');
const multer = require('multer');
const router = express.Router();
const branchOfficeController = require('../controllers/branch-office');
const jwtAuth = require('../middlewares/auth');


router.use([
    jwtAuth,
]);

router.route('/')
    .get(branchOfficeController.index)
    .post(branchOfficeController.create);

router.route('/:branchOfficeId')
    .get(branchOfficeController.show)
    .patch(branchOfficeController.update)
    .delete(branchOfficeController.unlink);

module.exports = router;
