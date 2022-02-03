const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2')

const ProvinceSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: [true, 'name cannot be empty']
        },
    },
    { timestamps: { createdAt: 'createdAt', updatedAt: 'createdAt' } }
);

ProvinceSchema.post( 'save', function (error, doc, next) {
    error.messages = error.message.split(", ")
    next();
});

ProvinceSchema.post( 'update', function (error, doc, next) {
    error.messages = error.message.split(", ")
    next();
});

ProvinceSchema.plugin(mongoosePaginate)

const schemaModel = mongoose.model('province', ProvinceSchema);
schemaModel.paginate().then({})
module.exports = schemaModel