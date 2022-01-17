const User = require('../models/user');

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


module.exports = {
    update,
}
