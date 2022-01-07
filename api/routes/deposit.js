const express = require('express');
const multer = require('multer');
const router = express.Router();
const depositController = require('../controllers/deposit');
const jwtAuth = require('../middlewares/auth');

const storageExcel = multer.diskStorage({
    destination: function (request, response, callback) {
        callback(null, `./uploads/excels/`)
    },
    filename: function(request, response, callback) {
        const mimetype = response.mimetype.split('/')
        const filetype = mimetype[1]
        callback(null, `${new Date().getTime()}-${response.originalname}`)
    }
})

const uploadExcel = multer({
    storage: storageExcel,
    limits: {
        fileSize: 1024 * 1024 * 25
    }
})

router.use([
    jwtAuth,
]);

router.route('/:memberId')
    .get(depositController.getByMemberId)

router.route('/exportExcel')
    .get(depositController.exportExcel)

router.route('/importExcel')
    .post([
        uploadExcel.single('file')
    ],depositController.importExcel)

module.exports = router;
