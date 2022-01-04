const express = require('express');
const router = express.Router();

router.route('/')
    .get((_, res)=>{
        res.status(201);
        res.json({
            message: "hello world"
        })
    });
    
module.exports = router;