const sanitize = require('mongo-sanitize');
const mongoose = require('mongoose');

const Installment = require('../../models/installment');

const getByContractId = async (req, res) => {
    const contractId = req.params.contractId;
    const page = sanitize(req.query.page) ? sanitize(req.query.page) : 1
    const limit = sanitize(req.query.limit) ? sanitize(req.query.limit) : 10

    const query = { contract_id: contractId }
    let sum = await Installment.aggregate(
        [
            { $match: { contract_id: mongoose.Types.ObjectId(contractId) }},
            {
                $group: {
                    _id: "$contract_id",
                    total: {
                        $sum: "$amount"
                    }
                }
            }
        ],
    );

    return Installment.paginate(query, { page: page, limit: limit })
        .then(installments => {
            if (installments) {
                installments.sum = sum.length > 0  ? sum[0].total: 0;
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
