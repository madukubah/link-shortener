const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2')

const MemberSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'name cannot be empty']
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
        pin: {
            type: Number,
            trim: true,
            required: [true, 'pin number cannot be empty']
        },
        company_name: {
            type: String,
            trim: true,
            required: [true, 'company name cannot be empty']
        },
        branch_name: {
            type: String,
            trim: true,
            required: [true, 'company branch cannot be empty']
        },
        city: {
            type: String,
            trim: true,
            required: [true, 'city cannot be empty']
        },
        join_date: {
            type: Date,
            required: [true, 'join date cannot be empty']
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
        total_savings: {
            type: Number,
        },
        savings_type: {
            type: String,
            trim: true,
            required: [true, 'savings type cannot be empty']
        },
        status: {
            type: String,
            trim: true,
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