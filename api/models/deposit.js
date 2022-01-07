const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2')

const DepositSchema = new mongoose.Schema(
    {
        member_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, 'employee id cannot be empty']
        },
        amount: {
            type: Number,
            trim: true,
        },
        date: {
            type: Date,
            required: [true, 'join date cannot be empty'],
            default: Date.now()
        },
    },
    { timestamps: { createdAt: 'createdAt', updatedAt: 'createdAt' } }
);

DepositSchema.post( 'save', function (error, doc, next) {
    error.messages = error.message.split(", ")
    next();
});

DepositSchema.post( 'update', function (error, doc, next) {
    error.messages = error.message.split(", ")
    next();
});

DepositSchema.plugin(mongoosePaginate)

const schemaModel = mongoose.model('deposit', DepositSchema);
schemaModel.paginate().then({})
module.exports = schemaModel