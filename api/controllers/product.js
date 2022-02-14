const sanitize = require('mongo-sanitize');

const Product = require('../models/product');

const create = async (req, res) => {
    try {
        const filePath = `/uploads/products/${req.file.filename}`;
        req.body.image_url = filePath
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
    let products = await Product.paginate(query, { page: page, limit: limit })
    res.status(200);
    res.json(products);
}

const show = (req, res) => {
    const id = req.params.productId;
    return Product.findById(id)
        .then(product => {
            if (product) {
                res.status(200);
                res.json(product);
            }
            else {
                res.status(404);
                res.json({
                    errors: ["Not Found"]
                });
            }
        })
        .catch(err => {
            res.status(500);
            res.json({
                errors: [err.message]
            });
        })
}

const update = (req, res) => {
    let id = req.params.productId;
    let newdata = req.body;

    if(req.file && req.file.filename) {
        const filePath = `./uploads/products/${req.file.filename}`
        newdata.image_url = filePath
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
