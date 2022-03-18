const mongoose = require('mongoose');
const sanitize = require('mongo-sanitize');
const SaleOrder = require('../../models/sale-order');
const SaleOrderLine = require('../../models/sale-orderline');

const create = async (req, res) => {
    try {
        const user_id = req.user.id;
        let orderlines = req.body.orderlines
        let saleData = req.body
        delete saleData.orderlines;

        saleData.name = Date.now()
        saleData.user_id = user_id
        saleData.total_amount = orderlines.reduce( (previousValue, currentValue) => currentValue.amount + previousValue, 0 )
        let saleOrder = await SaleOrder.create(saleData) ;
        orderlines.map(val => {
            val.sale_id = saleOrder._id;
            return val;
        })
        let saleOrderLines = await SaleOrderLine.insertMany(orderlines)
        res.status(201);
        res.json(saleOrder)
        return
    } catch (err) {
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
    const userId = req.user.id;

    let saleOrderAggregate = SaleOrder.aggregate([
        { $match: { user_id: mongoose.Types.ObjectId(userId) }},
        {
            $lookup:
            {
                from: "sale-orderlines",
                let: { "sale_id": "$_id" },
                as: "orderlines",
                pipeline :[
                    {
                        $match: { 
                            $expr: { $eq: ["$$sale_id", "$sale_id"] }
                        }
                    },
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
                ],

            }
        },
    ]);
    let saleOrders = await SaleOrder.aggregatePaginate(saleOrderAggregate, { page: page, limit: limit })
    res.status(200);
    res.json(saleOrders);
}

const show = async (req, res) => {
    const id = req.params.saleOrderId;
    let saleOrderAggregate = await SaleOrder.aggregate([
        {$match: {_id : mongoose.Types.ObjectId(id) }} ,
        {
            $lookup:
            {
                from: "sale-orderlines",
                let: { "sale_id": "$_id" },
                pipeline :[
                    {
                        $match: { 
                            $expr: { $eq: ["$$sale_id", "$sale_id"] }
                        }
                    },
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
                ],
                as: "orderlines",
            }
        },
    ]);

    res.status(200);
    res.json(saleOrderAggregate.length > 0 ? saleOrderAggregate[0] : {} );
    return
}

const update = (req, res) => {
    let id = req.params.saleOrderId;
    let newdata = req.body;
    return SaleOrder.findByIdAndUpdate(id, newdata, { runValidators: true })
        .then(result => {
            if (result) {
                return SaleOrder.findById(result._id).then(saleOrder => {
                    res.status(200);
                    res.json(saleOrder);
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
    let id = req.params.saleOrderId;
    return SaleOrder.findByIdAndRemove(id)
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
