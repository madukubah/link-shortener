const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2')

const LinkSchema = new mongoose.Schema(
    {
        username: {
            type: String,
        },
        host: {
            type: String,
        },
        short: {
            type: String,
        },
        redirect: {
            type: String,
        },
    },
    { timestamps: { createdAt: 'createdAt', updatedAt: 'createdAt' } }
);
LinkSchema.plugin(mongoosePaginate);
const schemaModel = mongoose.model('link', LinkSchema);
schemaModel.paginate().then({});
module.exports = schemaModel;
