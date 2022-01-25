const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2')

const BranchOffice = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
        },
    },
    { timestamps: { createdAt: 'createdAt', updatedAt: 'createdAt' } }
);

BranchOffice.post( 'save', function (error, doc, next) {
    error.messages = error.message.split(", ")
    next();
});

BranchOffice.post( 'update', function (error, doc, next) {
    error.messages = error.message.split(", ")
    next();
});

BranchOffice.plugin(mongoosePaginate)

const schemaModel = mongoose.model('branch-office', BranchOffice);
schemaModel.paginate().then({})
module.exports = schemaModel