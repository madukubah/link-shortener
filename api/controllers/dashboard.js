const Deposit = require('../models/deposit');
const LoanContract = require('../models/loan-contract');
const Member = require('../models/member');

const sumOfDeposit = async (req, res) => {
    try {
        let sum = await Deposit.aggregate(
            [
                {
                    $group: {
                        _id: "null",
                        total: {
                                $sum: "$amount"
                            }
                    }
                }
            ],
        );

        res.status(201);
        res.json(sum)
        return ;
    } catch (err) {
        res.status(500);
        res.json({
            errors: [err.message]
        });
        return;
    }
}

const sumOfActiveLoanContract = async (req, res) => {
    try {
        let sum = await LoanContract.aggregate(
            [
                { $match: { status: 'success' }},
                {
                    $group: {
                        _id: "null",
                        total: {
                                $sum: "$amount"
                            }
                    }
                }
            ],
        );

        res.status(201);
        res.json(sum)
        return ;
    } catch (err) {
        res.status(500);
        res.json({
            errors: [err.message]
        });
        return;
    }
}

const sumOfMemberGroup = async (req, res) => {
    try {
        let sum = await Member.aggregate(
            [
                {
                    $group: {
                        _id: "$status",
                        total: {
                                $sum: 1
                            }
                    }
                }
            ],
        );

        res.status(201);
        res.json(sum)
        return ;
    } catch (err) {
        res.status(500);
        res.json({
            errors: [err.message]
        });
        return;
    }
}

module.exports = {
    sumOfDeposit,
    sumOfActiveLoanContract,
    sumOfMemberGroup
}
