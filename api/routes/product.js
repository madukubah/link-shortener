const express = require('express');
const multer = require('multer');
const router = express.Router();
const productController = require('../controllers/product');
const jwtAuth = require('../middlewares/auth');

const storage = multer.diskStorage({
    destination: function(request, response, callback) {
        callback(null, './uploads/products/')
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
    .get(productController.index)
    .post([
        // upload.single('file')
        upload.fields([{name: 'banner', maxCount: 1}, {name: 'file', maxCount: 1}])
    ],productController.create);

router.route('/:productId')
    .get(productController.show)
    .patch([
        upload.fields([{name: 'banner', maxCount: 1}, {name: 'file', maxCount: 1}])
        // upload.single('file')
    ],productController.update)
    .delete(productController.unlink);

module.exports = router;
