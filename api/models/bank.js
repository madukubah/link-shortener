const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2')

const BankSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            default: "-"
        },
        account_name: {
            type: String,
            trim: true,
            default: '-',
        },
        account_number: {
            type: String,
            trim: true,
            default: '0',
        },
    },
    { timestamps: { createdAt: 'createdAt', updatedAt: 'createdAt' } }
);

BankSchema.post( 'save', function (error, doc, next) {
    error.messages = error.message.split(", ")
    next();
});

BankSchema.post( 'update', function (error, doc, next) {
    error.messages = error.message.split(", ")
    next();
});

BankSchema.plugin(mongoosePaginate)

const schemaModel = mongoose.model('bank', BankSchema);
schemaModel.paginate().then({})
module.exports = schemaModel