const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2')

const CitySchema = new mongoose.Schema(
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
    },
    { timestamps: { createdAt: 'createdAt', updatedAt: 'createdAt' } }
);

CitySchema.post( 'save', function (error, doc, next) {
    error.messages = error.message.split(", ")
    next();
});

CitySchema.post( 'update', function (error, doc, next) {
    error.messages = error.message.split(", ")
    next();
});

CitySchema.plugin(mongoosePaginate)

const schemaModel = mongoose.model('city', CitySchema);
schemaModel.paginate().then({})
module.exports = schemaModel