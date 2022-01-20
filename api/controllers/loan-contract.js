const sanitize = require('mongo-sanitize');

const LoanContract = require('../models/loan-contract');

const create = async (req, res) => {
    try {
        const {
            name,
            user_id,
            desc,
            period,
            amount,
            reduced,
            date,
            status
        } = req.body;

        return LoanContract.create({
            name: name,
            user_id: user_id,
            desc: desc,
            period: period,
            amount: amount,
            reduced: reduced,
            date: date
        })
            .then(loanContract => {
                res.status(201);
                res.json(loanContract)
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
    return LoanContract.paginate(query, { page: page, limit: limit })
        .then(loanContracts => {
            res.status(201);
            res.json(loanContracts)
        })
        .catch(error => {
            res.status(422);
            res.json({
                errors: error.messages
            });
        })
}

const show = (req, res) => {
    const id = req.params.contractId;
    console.log(id);
    return LoanContract.findById(id)
        .then(loanContract => {
            if (loanContract) {
                res.status(200);
                res.json(loanContract);
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
    let id = req.params.contractId;
    let newdata = req.body;
    return LoanContract.findByIdAndUpdate(id, newdata, { runValidators: true })
        .then(result => {
            if (result) {
                return LoanContract.findById(result._id).then(loanContract => {
                    res.status(200);
                    res.json(loanContract);
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

const getByUserId = (req, res) => {
    const id = req.params.userId;
    const page = sanitize(req.query.page) ? sanitize(req.query.page) : 1
    const limit = sanitize(req.query.limit) ? sanitize(req.query.limit) : 10

    const query = { user_id: id }
    return LoanContract.paginate(query, { page: page, limit: limit })
        .then(loanContracts => {
            res.status(200);
            res.json(loanContracts);
        })
        .catch(err => {
            res.status(500);
            res.json({
                errors: [err.message]
            });
        })
}

module.exports = {
    index,
    getByUserId,
    create,
    update,
    show
}
