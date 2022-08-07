const express = require('express');
const router = express.Router();
const linkController = require('../controllers/link');

router.route('/')
    .get((_, res)=>{
        res.status(201);
        res.json({
            message: "hello world"
        })
    });

router.route('/:short')
    .get(linkController.short)

module.exports = router;