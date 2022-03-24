const express = require('express');
const router = express.Router();
const multer = require('multer');
const bankController = require('../../controllers/mobile/bank');
const jwtAuth = require('../../middlewares/auth');

const storage = multer.diskStorage({
    destination: function(request, response, callback) {
        callback(null, './uploads/banks/')
    },
    filename: function(request, response, callback) {
        const mimetype = response.mimetype.split('/')
        var filetype = mimetype[1]

        if (filetype == 'octet-stream') {
            filetype = 'jpg';
        }

        callback(null, `${new Date().getTime()}.${filetype}`)
    }
})
const upload = multer({
    storage: storage,
    fileFilter: function (req, file, callback) {
        const mimetype = file.mimetype.split('/')
        var filetype = mimetype[1]
        
        if (filetype == 'octet-stream') {
            filetype = 'jpg';
        }

        var mimetypes = ["jpeg", "png", "jpg"];

        if (!mimetypes.includes(filetype)) {
            const error = new Error("Only images are allowed");
            error.status = 400;
            return callback(error)
        }
        
        callback(null, true)
    },
    limits: {
        fileSize: 5 * 1024 * 1024, // no larger than 5mb, you can change as needed.
    },
});

router.use([
    jwtAuth,
]);

router.route('/')
    .get(bankController.index)
    .post([
        upload.single('file')
    ],bankController.create);

router.route('/:bankId')
    .get(bankController.show)
    .patch([
        upload.single('file')
    ],bankController.update)
    .delete(bankController.unlink);

module.exports = router;
