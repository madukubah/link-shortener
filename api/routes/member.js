const express = require('express');
const multer = require('multer');
const router = express.Router();
const memberController = require('../controllers/member');
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


// router.use([
//     jwtAuth,
// ]);

router.route('/')
    .get(memberController.index)
    .post(memberController.create);

router.route('/exportExcel')
    .get(memberController.exportExcel)

router.route('/exportExcelTemplate')
    .get(memberController.exportExcelTemplate)

router.route('/:memberId')
    .get(memberController.show)
    .patch(memberController.update)
    .delete(memberController.unlink);

router.route('/importExcel')
    .post([
        uploadExcel.single('file')
    ],memberController.importExcel)
module.exports = router;
