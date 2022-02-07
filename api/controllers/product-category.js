const ProductCategory = require('../models/product-category');

const create = async (req, res) => {
    try {
        return ProductCategory.create(req.body)
            .then(productCategory => {
                res.status(201);
                res.json(productCategory)
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
    const search = req.query.search

    let query = {}
    if(search) {
        query["$or"] = [
            {
                name: new RegExp(`${search}`, 'i')
            },
        ];
    }
    let productCategories = await ProductCategory.find(query)
    res.status(200);
    res.json(productCategories);
}

const show = (req, res) => {
    const id = req.params.productCategoryId;
    return ProductCategory.findById(id)
        .then(productCategory => {
            if (productCategory) {
                res.status(200);
                res.json(productCategory);
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
    let id = req.params.productCategoryId;
    let newdata = req.body;
    return ProductCategory.findByIdAndUpdate(id, newdata, { runValidators: true })
        .then(result => {
            if (result) {
                return ProductCategory.findById(result._id).then(productCategory => {
                    res.status(200);
                    res.json(productCategory);
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
    let id = req.params.productCategoryId;
    return ProductCategory.findByIdAndRemove(id)
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
