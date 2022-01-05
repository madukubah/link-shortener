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
        }
    },
    { timestamps: { createdAt: 'createdAt', updatedAt: 'createdAt' } }
);

module.exports = mongoose.model('user', UserSchema);
