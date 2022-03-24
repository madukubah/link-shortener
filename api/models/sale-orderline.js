const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2')
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const SaleOrderLineSchema = new mongoose.Schema(
    {
        sale_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, 'sale cannot be empty']
        },
        product_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, 'product cannot be empty']
        },
        quantity: {
            type: Number,
            trim: true,
        },
        price: {
            type: Number,
            trim: true,
        },
        amount: {
            type: Number,
            trim: true,
        },
    },
    { timestamps: { createdAt: 'createdAt', updatedAt: 'createdAt' } }
);

SaleOrderLineSchema.post( 'save', function (error, doc, next) {
    error.messages = error.message.split(", ")
    next();
});

SaleOrderLineSchema.post( 'update', function (error, doc, next) {
    error.messages = error.message.split(", ")
    next();
});

SaleOrderLineSchema.plugin(aggregatePaginate)
// SaleOrderLineSchema.plugin(mongoosePaginate)

const schemaModel = mongoose.model('sale-orderline', SaleOrderLineSchema);
// schemaModel.paginate().then({})
module.exports = schemaModel