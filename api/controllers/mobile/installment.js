const sanitize = require('mongo-sanitize');

const Installment = require('../../models/installment');

const getByContractId = (req, res) => {
    const contractId = req.params.contractId;
    const page = sanitize(req.query.page) ? sanitize(req.query.page) : 1
    const limit = sanitize(req.query.limit) ? sanitize(req.query.limit) : 10

    const query = { contract_id: contractId }
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
    getByContractId,
}
