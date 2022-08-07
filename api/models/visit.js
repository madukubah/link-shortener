const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2')

const VisitSchema = new mongoose.Schema(
    {
        
        username: {
            type: String,
        },
        ip: {
            type: String,
        },
        host: {
            type: String,
        },
        short: {
            type: String,
        },
        date: {
            type: Date,
            required: [true, 'date cannot be empty'],
            default: Date.now()
        },
        day: {
            type: Number,
            required: [true, 'date cannot be empty'],
            default: ()=>{
                let date = new Date();
                return date.getDate();
            }
        },
        month: {
            type: Number,
            required: [true, 'date cannot be empty'],
            default: ()=>{
                let date = new Date();
                return date.getMonth()+1;
            }
        },
        year: {
            type: Number,
            required: [true, 'date cannot be empty'],
            default: ()=>{
                let date = new Date();
                return date.getFullYear();
            }
        },
    },
    { timestamps: { createdAt: 'createdAt', updatedAt: 'createdAt' } }
);

VisitSchema.plugin(mongoosePaginate);
const schemaModel = mongoose.model('visit', VisitSchema);
schemaModel.paginate().then({});
module.exports = schemaModel;
