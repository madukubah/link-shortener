const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2')

const MemberSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'name cannot be empty']
        },
        id_number: {
            type: String,
            unique: true,
            required: [true, 'id number cannot be empty']
        },
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, 'user id cannot be empty']
        },
        branch_id: {
            type: mongoose.Schema.Types.ObjectId,
            // required: [true, 'branch id cannot be empty']
        },
        employee_no: {
            type: String,
            trim: true,
            unique: true,
            required: [true, 'employee number cannot be empty']
        },
        email: {
            type: String,
            trim: true,
            unique: true,
            required: [true, 'email address number cannot be empty'],
            match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
        },
        phone: {
            type: String,
            trim: true,
            required: [true, 'phone number cannot be empty']
        },
        join_date: {
            type: Date,
            // required: [true, 'join date cannot be empty']
            default: Date.now()
        },
        end_date: {
            type: Date,
            // required: [true, 'end date cannot be empty']
            default: Date.now()
        },
        salary: {
            type: Number,
            trim: true,
            required: [true, 'salary cannot be empty']
        },
        deposit_amount: {
            type: Number,
            trim: true,
            required: [true, 'deposit amount cannot be empty']
        },
        savings_type: {
            type: String,
            trim: true,
            required: [true, 'savings type cannot be empty'],
            default: 'wajib'
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

MemberSchema.post( 'save', function (error, doc, next) {
    error.messages = error.message.split(", ")
    next();
});

MemberSchema.post( 'update', function (error, doc, next) {
    error.messages = error.message.split(", ")
    next();
});

MemberSchema.plugin(mongoosePaginate)

const schemaModel = mongoose.model('member', MemberSchema);
schemaModel.paginate().then({})
module.exports = schemaModel