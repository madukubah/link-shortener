const express = require('express');
const router = express.Router();
const visitController = require('../controllers/visit');
const jwtAuth = require('../middlewares/auth');

// router.use([
//     jwtAuth,
// ]);

router.route('/')
    .get(visitController.index);
    
module.exports = router;
