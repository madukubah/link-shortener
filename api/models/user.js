const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            trim: true,
            unique: true,
            required: true,
        },
        password: {
            type: String,
            required: true,
            set: v => bcrypt.hashSync(v, bcrypt.genSaltSync()),
        },
        pin: {
            type: Number,
            trim: true,
            required: true,
        },
        is_new: {
            type: Boolean,
            default: true,
        },
        token: {
            type: String,
        },
        role: {
            type: String,
            enum: ['admin', 'user'],
            default: 'user',
        },
    },
    { timestamps: { createdAt: 'createdAt', updatedAt: 'createdAt' } }
);

module.exports = mongoose.model('user', UserSchema);
