const sanitize = require('mongo-sanitize');
const mongoose = require('mongoose');

const LoanContract = require('../../models/loan-contract');
const SummaryCut = require('../../models/summary-cut');
const User = require('../../models/user');
const Installment = require('../../models/installment');

const create = async (req, res) => {
    try {
        const user_id = req.user.id;
        const {
            name,
            desc,
            period,
            amount,
            reduced,
            date,
            pin
        } = req.body;
        const user = await User.findOne({ _id: user_id, pin: pin });
        if(!user) throw new Error("pin false");

        return LoanContract.create({
            name: name,
            user_id: user_id,
            desc: desc,
            period: period,
            amount: amount,
            reduced: reduced,
            instalment_per_period: (amount - reduced)/ period,
            date: date
        })
            .then(loanContract => {
                return SummaryCut.create({
                    user_id: user_id,
                    ref_id: loanContract._id,
                    type: 'loan',
                    amount: ( amount - reduced ) / period,
                }).then( summaryCut => {
                    res.status(201);
                    res.json(loanContract)
                })
            })
            .catch(error => {
                res.status(422);
                res.json({
                    message: error.message
                });
            })
    } catch (err) {
        res.status(500);
        res.json({
            message: err.message
        });
        return;
    }
}

const show = async (req, res) => {
    const contractId = req.params.contractId;

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
    console.log(sum)

    return LoanContract.findById(contractId)
        .then(loanContract => {
            if (loanContract) {
                res.status(200);
                res.json({
                    installment_sum: sum.length > 0  ? sum[0].total: 0,
                    ...loanContract._doc
                });
            }
            else {
                res.status(404);
                res.json({
                    message: ["Not Found"]
                });
            }
        })
        .catch(err => {
            res.status(500);
            res.json({
                message: err.message
            });
        })
}

const getByUserId = (req, res) => {
    const userId = req.user.id;
    const page = sanitize(req.query.page) ? sanitize(req.query.page) : 1
    const limit = sanitize(req.query.limit) ? sanitize(req.query.limit) : 10
    const status = req.query.status

    let query = {
        user_id: mongoose.Types.ObjectId(userId)
    }
    if(status) {
        query['status'] = status
    }
    let loanContractAggregate = LoanContract.aggregate([
        { $match: query },
        {
            $lookup:
            {
                from: "members",
                localField: "user_id",
                foreignField: "user_id",
                as: "member"
            }
        },
        { $unwind: "$member" }
        
    ]);
    return LoanContract.aggregatePaginate(loanContractAggregate, { page: page, limit: limit })
        .then(loanContracts => {
            res.status(200);
            res.json(loanContracts);
        })
        .catch(err => {
            res.status(500);
            res.json({
                message: err.message
            });
        })
}

module.exports = {
    getByUserId,
    create,
    show
}
