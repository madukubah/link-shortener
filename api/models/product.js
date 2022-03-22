const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2')
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const ProductSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: [true, 'name cannot be empty']
        },
        desc: {
            type: String,
            trim: true,
            default: " "
        },
        price: {
            type: Number,
            trim: true,
        },
        product_category_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, 'product category cannot be empty']
        },
        image_url: {
            type: String,
            trim: true,
            required: [true, 'image cannot be empty']
        },
        weight: {
            type: Number,
            trim: true,
        },
        minimal_purchase: {
            type: Number,
            trim: true,
        },
        is_highlight: {
            type: Boolean,
            default: false,
        },
        banner_url: {
            type: String,
            trim: true,
            required: [true, 'image cannot be empty'],
            default:"/uploads/products/default.jpg"
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

ProductSchema.post( 'save', function (error, doc, next) {
    error.messages = error.message.split(", ")
    next();
});

ProductSchema.post( 'update', function (error, doc, next) {
    error.messages = error.message.split(", ")
    next();
});

ProductSchema.plugin(aggregatePaginate)
// ProductSchema.plugin(mongoosePaginate)

const schemaModel = mongoose.model('product', ProductSchema);
// schemaModel.paginate().then({})
module.exports = schemaModel