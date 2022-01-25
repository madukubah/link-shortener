const sanitize = require('mongo-sanitize');

const Installment = require('../models/installment');

const create = async (req, res) => {
    try {
        const {
            contract_id,
            amount,
            date,
        } = req.body;

        return Installment.create({
            contract_id: contract_id,
            amount: amount,
            date: date
        })
            .then(installment => {
                res.status(201);
                res.json(installment)
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
    return Installment.paginate(query, { page: page, limit: limit })
        .then(installments => {
            res.status(201);
            res.json(installments)
        })
        .catch(error => {
            res.status(422);
            res.json({
                errors: error.messages
            });
        })
}

const getByContractId = (req, res) => {
    const id = req.params.contractId;
    const page = sanitize(req.query.page) ? sanitize(req.query.page) : 1
    const limit = sanitize(req.query.limit) ? sanitize(req.query.limit) : 10

    const query = { contract_id: id }
    return Installment.paginate(query, { page: page, limit: limit })
        .then(installments => {
            if (installments) {
                res.status(200);
                res.json(installments);
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

module.exports = {
    index,
    getByContractId,
    create
}
