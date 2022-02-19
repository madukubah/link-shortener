const sanitize = require('mongo-sanitize');
const mongoose = require('mongoose');

const Deposit = require('../../models/deposit');
const Member = require('../../models/member');

const getByUserId = async (req, res) => {
    const userId = req.user.id;
    const page = sanitize(req.query.page) ? sanitize(req.query.page) : 1
    const limit = sanitize(req.query.limit) ? sanitize(req.query.limit) : 10

    let member = await Member.findOne({user_id: userId});

    let sum = await Deposit.aggregate(
        [
            { $match: { member_id: mongoose.Types.ObjectId(member._id) }},
            {
                $group: {
                    _id: "$member_id",
                    total: {
                        $sum: "$amount"
                    }
                }
            }
        ],
    );
    
    const query = { member_id: member._id }
    return Deposit.paginate(query, { page: page, limit: limit })
        .then(deposits => {
            deposits.sum = sum.length>0  ? sum[0].total: 0;
            res.status(200);
            res.json(deposits);
        })
        .catch(err => {
            res.status(500);
            res.json({
                message: err.message
            });
        })
}

const sumOfDeposit = async (req, res) => {
    try {
        const userId = req.user.id;
        console.log(req.user.id);
        let member = await Member.findOne({user_id: userId});
        console.log(member._id);
        let sum = await Deposit.aggregate(
            [
                { $match: { member_id: mongoose.Types.ObjectId(member._id) }},
                {
                    $group: {
                        _id: "$member_id",
                        balance: {
                            $sum: "$amount"
                        }
                    }
                }
            ],
        );
        result = {
            balance: sum.length>0 ? sum[0].balance: 0
        }
        res.status(201);
        res.json(result)
        return ;
    } catch (err) {
        res.status(500);
        res.json({
            message: err.message
        });
        return;
    }
}

module.exports = {
    getByUserId,
    sumOfDeposit
}
