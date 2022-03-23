const sanitize = require('mongo-sanitize');
const Bank = require('../../models/bank');

const create = async (req, res) => {
    try {
        return Bank.create(req.body)
            .then(bank => {
                res.status(201);
                res.json(bank)
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
            }
        ];
    }
    let banks = await Bank.paginate(query, { page: page, limit: limit })
    res.status(200);
    res.json(banks);
}

const show = (req, res) => {
    const id = req.params.bankId;
    return Bank.findById(id)
        .then(bank => {
            if (bank) {
                res.status(200);
                res.json(bank);
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
    let id = req.params.bankId;
    let newdata = req.body;
    return Bank.findByIdAndUpdate(id, newdata, { runValidators: true })
        .then(result => {
            if (result) {
                return Bank.findById(result._id).then(bank => {
                    res.status(200);
                    res.json(bank);
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
    let id = req.params.bankId;
    return Bank.findByIdAndRemove(id)
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
