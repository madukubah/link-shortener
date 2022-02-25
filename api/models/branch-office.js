const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2')
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const BranchOfficeSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: [true, 'name cannot be empty']
        },
        province_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, 'province cannot be empty']
        },
        city_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, 'city cannot be empty']
        },
        address: {
            type: String,
            trim: true,
            required: [true, 'address cannot be empty']
        },

    },
    { timestamps: { createdAt: 'createdAt', updatedAt: 'createdAt' } }
);

BranchOfficeSchema.post( 'save', function (error, doc, next) {
    error.messages = error.message.split(", ")
    next();
});

BranchOfficeSchema.post( 'update', function (error, doc, next) {
    error.messages = error.message.split(", ")
    next();
});

BranchOfficeSchema.plugin(aggregatePaginate)
// BranchOfficeSchema.plugin(mongoosePaginate)

const schemaModel = mongoose.model('branch-office', BranchOfficeSchema);
// schemaModel.paginate().then({})
module.exports = schemaModel