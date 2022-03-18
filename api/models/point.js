const mongoose = require('mongoose');
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const PointSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, 'user_id cannot be empty']
        },
        amount: {
            type: Number,
            default: 0
        },
    },
    { timestamps: { createdAt: 'createdAt', updatedAt: 'createdAt' } }
);

PointSchema.post( 'save', function (error, doc, next) {
    error.messages = error.message.split(", ")
    next();
});

PointSchema.post( 'update', function (error, doc, next) {
    error.messages = error.message.split(", ")
    next();
});

PointSchema.plugin(aggregatePaginate)

const schemaModel = mongoose.model('point', PointSchema);
module.exports = schemaModel