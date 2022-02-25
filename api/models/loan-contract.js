const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2')
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const LoanContractSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'name cannot be empty']
        },
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, 'employee id cannot be empty']
        },
        desc: {
            type: String,
            required: [true, 'desc cannot be empty']
        },
        period: {
            type: Number,
            trim: true,
            defaut: 0
        },
        amount: {
            type: Number,
            trim: true,
            defaut: 0
        },
        reduced: {
            type: Number,
            trim: true,
            defaut: 0
        },
        date: {
            type: Date,
            required: [true, 'date cannot be empty'],
            default: Date.now()
        },
        status: {
            type: String,
            enum: ['draft', 'process', 'success', 'cancel'],
            default: 'draft',
            required: [true, 'status cannot be empty']
        },
    },
    { timestamps: { createdAt: 'createdAt', updatedAt: 'createdAt' } }
);

LoanContractSchema.post( 'save', function (error, doc, next) {
    error.messages = error.message.split(", ")
    next();
});

LoanContractSchema.post( 'update', function (error, doc, next) {
    error.messages = error.message.split(", ")
    next();
});

LoanContractSchema.plugin(aggregatePaginate)
// LoanContractSchema.plugin(mongoosePaginate)

const schemaModel = mongoose.model('loan-contract', LoanContractSchema);
// schemaModel.paginate().then({})
module.exports = schemaModel
