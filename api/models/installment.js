const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2')

const InstallmentSchema = new mongoose.Schema(
    {
        member_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, 'employee id cannot be empty']
        },
        contract_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, 'contract id cannot be empty']
        },
        amount: {
            type: Number,
            trim: true,
        },
        date: {
            type: Date,
            required: [true, 'date cannot be empty'],
            default: Date.now()
        },
    },
    { timestamps: { createdAt: 'createdAt', updatedAt: 'createdAt' } }
);

InstallmentSchema.post( 'save', function (error, doc, next) {
    error.messages = error.message.split(", ")
    next();
});

InstallmentSchema.post( 'update', function (error, doc, next) {
    error.messages = error.message.split(", ")
    next();
});

InstallmentSchema.plugin(mongoosePaginate)

const schemaModel = mongoose.model('installment', InstallmentSchema);
schemaModel.paginate().then({})
module.exports = schemaModel
