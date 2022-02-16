const sanitize = require('mongo-sanitize');
const Province = require('../models/province');

const create = async (req, res) => {
    try {
        return Province.create(req.body)
            .then(province => {
                res.status(201);
                res.json(province)
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
    const search = req.query.search

    let query = {}
    if(search) {
        query["$or"] = [
            {
                name: new RegExp(`${search}`, 'i')
            },
        ];
    }
    let provinces = await Province.paginate(query, { page: page, limit: limit })
    res.status(200);
    res.json(provinces);
}

const show = (req, res) => {
    const id = req.params.provinceId;
    return Province.findById(id)
        .then(province => {
            if (province) {
                res.status(200);
                res.json(province);
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
    let id = req.params.provinceId;
    let newdata = req.body;
    return Province.findByIdAndUpdate(id, newdata, { runValidators: true })
        .then(result => {
            if (result) {
                return Province.findById(result._id).then(province => {
                    res.status(200);
                    res.json(province);
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
    let id = req.params.provinceId;
    return Province.findByIdAndRemove(id)
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
