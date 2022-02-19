const express = require('express');
const multer = require('multer');
const router = express.Router();
const articleController = require('../../controllers/mobile/article');
const jwtAuth = require('../../middlewares/auth');

router.use([
    jwtAuth,
]);

router.route('/')
    .get(articleController.index)

router.route('/:articleId')
    .get(articleController.show)

module.exports = router;
