const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2')

const SummaryCutSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, 'employee id cannot be empty']
        },
        ref_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, 'employee id cannot be empty']
        },
        type: {
            type: String,
            enum: ['deposit', 'loan','credit','tempo'],
        },
        amount: {
            type: Number,
            trim: true,
        },
        status: {
            type: String,
            enum: ['active', 'nonactive'],
            default: 'active',
            required: [true, 'status cannot be empty']
        },
    },
    { timestamps: { createdAt: 'createdAt', updatedAt: 'createdAt' } }
);

SummaryCutSchema.post( 'save', function (error, doc, next) {
    error.messages = error.message.split(", ")
    next();
});

SummaryCutSchema.post( 'update', function (error, doc, next) {
    error.messages = error.message.split(", ")
    next();
});

SummaryCutSchema.plugin(mongoosePaginate)

const schemaModel = mongoose.model('summary-cut', SummaryCutSchema);
schemaModel.paginate().then({})
module.exports = schemaModel