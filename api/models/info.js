const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2')

const InfoSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            trim: true,
            required: [true, 'title cannot be empty']
        },
        content: {
            type: String,
            trim: true,
            default: '-',
        },
        type: {
            type: String,
            enum: ['terms and conditions', 'privacy policy', 'about'],
            default: 'about',
        },
    },
    { timestamps: { createdAt: 'createdAt', updatedAt: 'createdAt' } }
);

InfoSchema.post( 'save', function (error, doc, next) {
    error.messages = error.message.split(", ")
    next();
});

InfoSchema.post( 'update', function (error, doc, next) {
    error.messages = error.message.split(", ")
    next();
});

InfoSchema.plugin(mongoosePaginate)

const schemaModel = mongoose.model('info', InfoSchema);
schemaModel.paginate().then({})
module.exports = schemaModel