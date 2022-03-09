const User = require('../models/user');
const bcrypt = require('bcrypt');
const sender = require('../helpers/sender-rabbitmq')

const update = (req, res) => {
    let id = req.params.userId;
    let newdata = req.body;
    return User.findByIdAndUpdate(id, newdata, { runValidators: true })
        .then(result => {
            if (result) {
                return User.findById(result._id).then(member => {
                    res.status(200);
                    res.json(member);
                });
            }
            else {
                res.status(404);
                res.json({
                    errors: ["Not Found"]
                });
            }
        })
        .catch(error => {
            res.status(422);
            res.json({
                errors: [error.message]
            });
        })
}

sendResetPassword = async (request, response, next) => {
    try {
        const findEmail = await User.findOne({ username: request.body.username })
        if(findEmail) {
            findEmail.token = bcrypt.hashSync( `${Date.now()}` , bcrypt.genSaltSync());
            findEmail.save();
            if(request.body.link) {
                data = {
                    email: findEmail.email,
                    token: findEmail.token,
                    link: request.body.link
                }
                await sender.send(data, 'resetPassword')
                return response.status(200).json({
                    status: true,
                    message: 'The link for resetting the password has been sent to the email'
                })
            }
        }else {
            return response.status(401).json({
                status: false,
                message: 'Email has not been registered'
            })
        }
    }catch(error) {
        response.status(500).json({
            status: false,
            message: error.message
        })
    }
}

resetPassword = async (request, response, next) => {
    try {
        const user = await User.findOne({ token: request.body.token })
        if(user) {
            user.password = request.body.password
            user.save();
            return response.status(200).json({
                status: true,
                message: 'success'
            })
        }else {
            return response.status(401).json({
                status: false,
                message: 'user not found'
            })
        }
    }catch(error) {
        response.status(500).json({
            status: false,
            message: error.message
        })
    }
}


module.exports = {
    update,
    sendResetPassword,
    resetPassword
}
