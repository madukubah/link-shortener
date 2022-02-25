const sanitize = require('mongo-sanitize');

const Product = require('../../models/product');

const index = async (req, res) => {
    const page = sanitize(req.query.page) ? sanitize(req.query.page) : 1
    const limit = sanitize(req.query.limit) ? sanitize(req.query.limit) : 10
    const search = req.query.search
    const categoryId = req.query.categoryId

    let query = {}
    if(search) {
        query["$or"] = [
            {
                name: new RegExp(`${search}`, 'i')
            }
        ];
    }
    
    if(categoryId) {
        query["$or"] = [
            {
                product_category_id: categoryId
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
                    message: ["Not Found"]
                });
            }
        })
        .catch(err => {
            res.status(500);
            res.json({
                message: err.message
            });
        })
}


module.exports = {
    index,
    show
}
