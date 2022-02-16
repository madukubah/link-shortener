const sanitize = require('mongo-sanitize');
const City = require('../models/city');

const create = async (req, res) => {
    try {
        return City.create(req.body)
            .then(city => {
                res.status(201);
                res.json(city)
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
    let cities = await City.paginate(query, { page: page, limit: limit })
    res.status(200);
    res.json(cities);
}

const getByProvinceId = async (req, res) => {
    const provinceId = req.params.provinceId;
    const page = sanitize(req.query.page) ? sanitize(req.query.page) : 1
    const limit = sanitize(req.query.limit) ? sanitize(req.query.limit) : 10

    let query = { province_id: provinceId }

    let provinces = await City.paginate(query, { page: page, limit: limit })
    res.status(200);
    res.json(provinces);
}

const show = (req, res) => {
    const id = req.params.cityId;
    return City.findById(id)
        .then(city => {
            if (city) {
                res.status(200);
                res.json(city);
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
    let id = req.params.cityId;
    let newdata = req.body;
    return City.findByIdAndUpdate(id, newdata, { runValidators: true })
        .then(result => {
            if (result) {
                return City.findById(result._id).then(city => {
                    res.status(200);
                    res.json(city);
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
    let id = req.params.cityId;
    return City.findByIdAndRemove(id)
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
    unlink,
    getByProvinceId
}
