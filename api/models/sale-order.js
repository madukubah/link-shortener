const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2')
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const SaleOrderSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: [true, 'name cannot be empty']
        },
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, 'user cannot be empty']
        },
        date: {
            type: Date,
            required: [true, 'join date cannot be empty']
        },
        sale_type: {
            type: String,
            enum: ['credit', 'tempo'],
            // required: [true, 'sale_type cannot be empty']
        },
        payment_method: {
            type: String,
            enum: ['cash', 'transfer', 'salary_cut'],
            required: [true, 'payment_method cannot be empty']
        },
        total_amount: {
            type: Number,
            trim: true,
        },
        status: {
            type: String,
            enum: ['draft', 'process', 'done', 'cancel'],
            default: 'draft',
            required: [true, 'status cannot be empty']
        },
    },
    { timestamps: { createdAt: 'createdAt', updatedAt: 'createdAt' } }
);

SaleOrderSchema.post( 'save', function (error, doc, next) {
    error.messages = error.message.split(", ")
    next();
});

SaleOrderSchema.post( 'update', function (error, doc, next) {
    error.messages = error.message.split(", ")
    next();
});

SaleOrderSchema.plugin(aggregatePaginate)
// SaleOrderSchema.plugin(mongoosePaginate)

const schemaModel = mongoose.model('sale-order', SaleOrderSchema);
// schemaModel.paginate().then({})
module.exports = schemaModel