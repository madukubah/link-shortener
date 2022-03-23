const sanitize = require('mongo-sanitize');
const Info = require('../../models/info');

const create = async (req, res) => {
    try {
        return Info.create(req.body)
            .then(info => {
                res.status(201);
                res.json(info)
            })
            .catch(error => {
                res.status(422);
                res.json({
                    errors: error.messages
                });
            })
    } catch (err) {
        res.status(500);
        res.json({
            errors: [err.message]
        });
        return;
    }
}

const index = async (req, res) => {
    const page = sanitize(req.query.page) ? sanitize(req.query.page) : 1
    const limit = sanitize(req.query.limit) ? sanitize(req.query.limit) : 10
    const type = req.query.type

    let query = {}
    if(type) {
        query = {
            type : type
        }
    }
    let infos = await Info.paginate(query, { page: page, limit: limit })
    res.status(200);
    res.json(infos);
}

const show = (req, res) => {
    const id = req.params.infoId;
    return Info.findById(id)
        .then(info => {
            if (info) {
                res.status(200);
                res.json(info);
            }
            else {
                res.status(404);
                res.json({
                    errors: ["Not Found"]
                });
            }
        })
        .catch(err => {
            res.status(500);
            res.json({
                errors: [err.message]
            });
        })
}

const update = (req, res) => {
    let id = req.params.infoId;
    let newdata = req.body;
    return Info.findByIdAndUpdate(id, newdata, { runValidators: true })
        .then(result => {
            if (result) {
                return Info.findById(result._id).then(info => {
                    res.status(200);
                    res.json(info);
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

const unlink = (req, res) => {
    let id = req.params.infoId;
    return Info.findByIdAndRemove(id)
        .then(_ => {
            res.status(200);
            res.json({
                message: "successfully deleted"
            });
        })
        .catch(err => {
            res.status(422);
            res.json({
                errors: [err.message]
            });
        })
}

module.exports = {
    create,
    index,
    show,
    update,
    unlink
}
