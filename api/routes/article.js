const express = require('express');
const multer = require('multer');
const router = express.Router();
const articleController = require('../controllers/article');
const jwtAuth = require('../middlewares/auth');

const storage = multer.diskStorage({
    destination: function(request, response, callback) {
        callback(null, './uploads/articles/')
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
    .get(articleController.index)
    .post(articleController.create);

router.route('/:articleId')
    .get(articleController.show)
    .patch(articleController.update)
    .delete(articleController.unlink);

module.exports = router;
