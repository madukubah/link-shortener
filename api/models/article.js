const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2')

const ArticleSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            trim: true,
            required: [true, 'title cannot be empty']
        },
        author: {
            type: String,
            trim: true,
            required: [true, 'author cannot be empty']
        },
        image_url: {
            type: String,
            trim: true,
            required: [true, 'image cannot be empty']
        },
        content: {
            type: String,
            trim: true,
            default: '-',
        },
        status: {
            type: String,
            enum: ['publish', 'archive'],
            default: 'publish',
            required: [true, 'status cannot be empty']
        },
    },
    { timestamps: { createdAt: 'createdAt', updatedAt: 'createdAt' } }
);

ArticleSchema.post( 'save', function (error, doc, next) {
    error.messages = error.message.split(", ")
    next();
});

ArticleSchema.post( 'update', function (error, doc, next) {
    error.messages = error.message.split(", ")
    next();
});

ArticleSchema.plugin(mongoosePaginate)

const schemaModel = mongoose.model('article', ArticleSchema);
schemaModel.paginate().then({})
module.exports = schemaModel