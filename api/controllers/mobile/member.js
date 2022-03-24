const sanitize = require('mongo-sanitize');
const Member = require('../../models/member');

const update = (req, res) => {
    let id = req.params.memberId;
    let newdata = req.body;
    if(req.file && req.file.filename) {
        const filePath = `/uploads/users/${req.file.filename}`
        newdata.image_url = filePath
    }
    return Member.findByIdAndUpdate(id, newdata, { runValidators: true })
        .then(result => {
            if (result) {
                return Member.findById(result._id).then(member => {
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
    update
}
