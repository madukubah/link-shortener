const express = require('express');
const router = express.Router();
const linkController = require('../controllers/link');
const jwtAuth = require('../middlewares/auth');

// router.use([
//     jwtAuth,
// ]);

router.route('/')
    .get(linkController.index)
    .post(linkController.create);

router.route('/:linkId')
    .get(linkController.show)
    .patch(linkController.update)
    .delete(linkController.unlink);

module.exports = router;
