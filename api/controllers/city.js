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
    const search = req.query.search

    let query = {}
    if(search) {
        query["$or"] = [
            {
                name: new RegExp(`${search}`, 'i')
            },
        ];
    }
    let cities = await City.find(query)
    res.status(200);
    res.json(cities);
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
    unlink
}
