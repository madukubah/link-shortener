const jwt = require('jsonwebtoken');
const User = require('../../models/user');
const Member = require('../../models/member');
const bcrypt = require('bcrypt');

const signIn = async (req, res) => {
    try {
        let {
            username,
            password,
        } = req.body;

        if (!(username && password)) {
            res.status(400);
            res.json({
                message: ["All input is required"]
            })
            return
        }
        const user = await User.findOne({ username: username, role: 'user' });

        if (user && (await bcrypt.compare(password, user.password))) {
            const member = await Member.findOne({ user_id: user.id});
            const token = jwt.sign(
                {
                    id: user._id,
                    username: user.username,
                    pin: user.pin,
                    member: member
                },
                process.env.JWT_KEY,
                {
                    expiresIn: process.env.JWT_EXPIRY,
                }
            );
            res.status(200);
            res.json({
                token: token,
                is_new : user.is_new
            })
            return;
        }
        res.status(400);
        res.json({
            message: "Invalid Credentials"
        })
        return;
    } catch (err) {
        res.status(500);
        res.json({
            message: err.message
        });
        return;
    }
}

const update = async (req, res) => {
    let id = req.user.id;
    console.log(req.user);
    let newdata = req.body;
    return User.findByIdAndUpdate(id, newdata, { runValidators: true })
        .then(result => {
            if (result) {
                return User.findById(result._id).then(user => {
                    if(req.body.password || req.body.pin){
                        user.is_new = false
                        user.save()
                    }
                    res.status(200);
                    res.json(user);
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

module.exports = {
    signIn,
    update
}
