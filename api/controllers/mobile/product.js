const sanitize = require('mongo-sanitize');

const Product = require('../../models/product');

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


module.exports = {
    index,
    show
}
