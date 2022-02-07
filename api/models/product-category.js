const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2')

const ProductCategorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: [true, 'name cannot be empty']
        },
    },
    { timestamps: { createdAt: 'createdAt', updatedAt: 'createdAt' } }
);

ProductCategorySchema.post( 'save', function (error, doc, next) {
    error.messages = error.message.split(", ")
    next();
});

ProductCategorySchema.post( 'update', function (error, doc, next) {
    error.messages = error.message.split(", ")
    next();
});

ProductCategorySchema.plugin(mongoosePaginate)

const schemaModel = mongoose.model('product-category', ProductCategorySchema);
schemaModel.paginate().then({})
module.exports = schemaModel