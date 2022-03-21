const sanitize = require('mongo-sanitize');
const mongoose = require('mongoose');

const Product = require('../models/product');

const create = async (req, res) => {
    try {
        const filePath = `/uploads/products/${req.files.file[0].filename}`;
        req.body.image_url = filePath
        if( req.body.is_highlight && req.files.banner ){
            const bannerFilePath = `/uploads/products/${req.files.banner[0].filename}`;
            req.body.banner_url = bannerFilePath
        }
        return Product.create(req.body)
            .then(product => {
                res.status(201);
                res.json(product)
            })
            .catch(error => {
                res.status(422);
                res.json({
                    errors: error.messages
                });
            })
    } catch (err) {
        res.status(500);
        res.json({
            errors: [err.message]
        });
        return;
    }
}

const index = async (req, res) => {
    const page = sanitize(req.query.page) ? sanitize(req.query.page) : 1
    const limit = sanitize(req.query.limit) ? sanitize(req.query.limit) : 10
    const search = req.query.search

    let query = {}
    if(search) {
        query["$or"] = [
            {
                name: new RegExp(`${search}`, 'i')
            }
        ];
    }
    let productAggregate = Product.aggregate([
        {$match: query} ,
        {
            $lookup:
            {
                from: "product-categories",
                localField: "product_category_id",
                foreignField: "_id",
                as: "product_category"
            }
        },
        { $unwind: "$product_category" },
    ]);

    let products = await Product.aggregatePaginate(productAggregate, { page: page, limit: limit })
    res.status(200);
    res.json(products);
}

const show = async (req, res) => {
    const id = req.params.productId;

    let productAggregate = await Product.aggregate([
        {$match: {_id : mongoose.Types.ObjectId(id) }} ,
        {
            $lookup:
            {
                from: "product-categories",
                localField: "product_category_id",
                foreignField: "_id",
                as: "product_category"
            }
        },
        { $unwind: "$product_category" },
    ]);
    res.status(200);
    res.json(productAggregate.length > 0 ? productAggregate[0] : {} );
    return
}

const update = (req, res) => {
    let id = req.params.productId;
    let newdata = req.body;
    console.log(req.files)
    if(req.files && req.files.file) {
        const filePath = `/uploads/products/${req.files.file[0].filename}`;
        newdata.image_url = filePath
    }

    if(req.files && req.files.banner) {
        if( req.body.is_highlight ){
            const bannerFilePath = `/uploads/products/${req.files.banner[0].filename}`;
            req.body.banner_url = bannerFilePath
        }
    }


    return Product.findByIdAndUpdate(id, newdata, { runValidators: true })
        .then(result => {
            if (result) {
                return Product.findById(result._id).then(product => {
                    res.status(200);
                    res.json(product);
                });
            }
            else {
                res.status(404);
                res.json({
                    errors: ["Not Found"]
                });
            }
        })
        .catch(error => {
            res.status(422);
            res.json({
                errors: [error.message]
            });
        })
}

const unlink = (req, res) => {
    let id = req.params.productId;
    return Product.findByIdAndRemove(id)
        .then(_ => {
            res.status(200);
            res.json({
                message: "successfully deleted"
            });
        })
        .catch(err => {
            res.status(422);
            res.json({
                errors: [err.message]
            });
        })
}

module.exports = {
    create,
    index,
    show,
    update,
    unlink
}
