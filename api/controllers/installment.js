const sanitize = require('mongo-sanitize');

const Installment = require('../models/installment');
const LoanContract = require('../models/loan-contract');

const create = async (req, res) => {
    try {
        const {
            contract_id,
            amount,
            date,
        } = req.body;
        const loanContract = await LoanContract.findById(contract_id)
        if(!loanContract) throw new Error("No Contract");

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

const getByContractIdRangeDate = (req, res) => {
    const id = req.params.contractId;
    const page = sanitize(req.query.page) ? sanitize(req.query.page) : 1
    const limit = sanitize(req.query.limit) ? sanitize(req.query.limit) : 10
    const startDate = sanitize(req.query.startDate)
    const endDate = sanitize(req.query.endDate)

    const query = { 
        $and: [
            {contract_id: id},
            {date: {$gte:new Date(startDate),$lte:new Date(endDate)}}
        ]
    }
    return Installment.paginate(query, { page: page, limit: limit })
        .then(deposits => {
            res.status(200);
            res.json(deposits);
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
    getByContractIdRangeDate,
    create
}
