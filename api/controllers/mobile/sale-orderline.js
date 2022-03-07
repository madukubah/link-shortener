const mongoose = require('mongoose');
const sanitize = require('mongo-sanitize');
const SaleOrderLine = require('../../models/sale-orderline');
const SaleOrder = require('../../models/sale-order');
const Product = require('../../models/product');

const create = async (req, res) => {
    try {
        const {
            sale_id,
            product_id,
        } = req.body;
        
        const saleOrder = await SaleOrder.findById(sale_id)
        if(!saleOrder) throw new Error("No Sale");

        const product = await Product.findById(product_id)
        if(!product) throw new Error("No Product");

        return SaleOrderLine.create(req.body)
            .then(saleOrderLine => {
                res.status(201);
                res.json(saleOrderLine)
            })
            .catch(error => {
                res.status(422);
                res.json({
                    message: error.message
                });
            })
    } catch (error) {
        res.status(500);
        res.json({
            message: error.message
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
            },
        ];
    }
    let saleOrderLineAggregate = SaleOrderLine.aggregate([
        {$match: query} ,
        {
            $lookup:
            {
                from: "products",
                localField: "product_id",
                foreignField: "_id",
                as: "product",

            }       
        },
        { $unwind: "$product" },
    ]);
    let saleOrderLines = await SaleOrderLine.aggregatePaginate(saleOrderLineAggregate, { page: page, limit: limit })
    res.status(200);
    res.json(saleOrderLines);
}

const show = async (req, res) => {
    const id = req.params.saleOrderLineId;
    let saleOrderLineAggregate = await SaleOrderLine.aggregate([
        {$match: {_id : mongoose.Types.ObjectId(id) }} ,
        {
            $lookup:
            {
                from: "products",
                localField: "product_id",
                foreignField: "_id",
                as: "product",

            }       
        },
        { $unwind: "$product" },
    ]);
    res.status(200);
    res.json(saleOrderLineAggregate.length > 0 ? saleOrderLineAggregate[0] : {} );
    return
    
}

const update = (req, res) => {
    let id = req.params.saleOrderLineId;
    let newdata = req.body;
    return SaleOrderLine.findByIdAndUpdate(id, newdata, { runValidators: true })
        .then(result => {
            if (result) {
                return SaleOrderLine.findById(result._id).then(saleOrderLine => {
                    res.status(200);
                    res.json(saleOrderLine);
                });
            }
            else {
                res.status(404);
                res.json({
                    message: "Not Found"
                });
            }
        })
        .catch(error => {
            res.status(422);
            res.json({
                message: error.message
            });
        })
}

const unlink = (req, res) => {
    let id = req.params.saleOrderLineId;
    return SaleOrderLine.findByIdAndRemove(id)
        .then(_ => {
            res.status(200);
            res.json({
                message: "successfully deleted"
            });
        })
        .catch(err => {
            res.status(422);
            res.json({
                message: error.message
            });
        })
}

module.exports = {
    create,
    index,
    show,
    update,
    unlink,
}
