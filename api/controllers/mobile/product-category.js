const ProductCategory = require('../../models/product-category');


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

module.exports = {
    index,
}
