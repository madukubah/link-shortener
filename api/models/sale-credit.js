const mongoose = require('mongoose');
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const SaleCreditSchema = new mongoose.Schema(
    {
        sale_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, 'sale id cannot be empty']
        },
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, 'user id cannot be empty']
        },
        desc: {
            type: String,
            default: "-"
        },
        period: {
            type: Number,
            trim: true,
            default: 1
        },
        amount: {
            type: Number,
            trim: true,
            default: 0
        },
        reduced: {
            type: Number,
            trim: true,
            default: 0
        },
        instalment_per_period: {
            type: Number,
            trim: true,
            default: 0
        },
        date: {
            type: Date,
            required: [true, 'date cannot be empty'],
            default: Date.now()
        },
        status: {
            type: String,
            enum: ['draft', 'process', 'success', 'done', 'cancel'],
            default: 'draft',
            required: [true, 'status cannot be empty']
        },
    },
    { timestamps: { createdAt: 'createdAt', updatedAt: 'createdAt' } }
);

SaleCreditSchema.post( 'save', function (error, doc, next) {
    error.messages = error.message.split(", ")
    next();
});

SaleCreditSchema.post( 'update', function (error, doc, next) {
    error.messages = error.message.split(", ")
    next();
});

SaleCreditSchema.plugin(aggregatePaginate)

const schemaModel = mongoose.model('sale-credit', SaleCreditSchema);
module.exports = schemaModel
