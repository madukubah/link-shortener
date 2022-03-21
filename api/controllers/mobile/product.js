const sanitize = require('mongo-sanitize');
const mongoose = require('mongoose');

const Product = require('../../models/product');

const index = async (req, res) => {
    const page = sanitize(req.query.page) ? sanitize(req.query.page) : 1
    const limit = sanitize(req.query.limit) ? sanitize(req.query.limit) : 10
    const search = req.query.search
    const is_highlight = req.query.is_highlight
    const product_category_id = req.query.product_category_id

    let query = {}
    if(search || is_highlight) {
        query["$or"] = [
            {
                name: new RegExp(`${search}`, 'i')
            },
            {
                is_highlight:  (is_highlight === 'true')
            },
            {
                product_category_id:  mongoose.Types.ObjectId(product_category_id)
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


module.exports = {
    index,
    show
}
