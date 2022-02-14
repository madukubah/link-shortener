const jwt = require('jsonwebtoken');
const User = require('../models/user');
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
                errors: ["All input is required"]
            })
            return
        }
        const user = await User.findOne({ username });

        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign(
                {
                    id: user._id,
                    username: user.username,
                },
                process.env.JWT_KEY,
                {
                    expiresIn: process.env.JWT_EXPIRY,
                }
            );
            res.status(200);
            res.json({
                token: token
            })
            return;
        }
        res.status(400);
        res.json({
            errors: ["Invalid Credentials"]
        })
        return;
    } catch (err) {
        res.status(500);
        res.json({
            errors: [err.message]
        });
        return;
    }
}

module.exports = {
    signUp,
    signIn,
}
