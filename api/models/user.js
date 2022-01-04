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


// UserSchema.post( 'save', function (error, doc, next) {
//     // evorride duplicate error message
//     if(error.code && error.code === 11000){
//         error.message = "";
//         error.message = Object.keys(error.keyValue).join(", ")
//         error.message += " already taken";
//     }
//     next();
// });

// UserSchema.post( 'update', function (error, doc, next) {
//     // evorride duplicate error message
//     console.log(error);
//     if(error.code && error.code === 11000){
//         error.message = "";
//         error.message = Object.keys(error.keyValue).join(", ")
//         error.message += " already taken";
//     }
//     next();
// });

module.exports = mongoose.model('user', UserSchema);
