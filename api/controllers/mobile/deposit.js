const sanitize = require('mongo-sanitize');
const mongoose = require('mongoose');

const Deposit = require('../../models/deposit');
const Member = require('../../models/member');


const getByUserId = async (req, res) => {
    const userId = req.user.id;
    const page = sanitize(req.query.page) ? sanitize(req.query.page) : 1
    const limit = sanitize(req.query.limit) ? sanitize(req.query.limit) : 10

    let member = await Member.find({user_id: userId});

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
            deposits.sum = sum;
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

module.exports = {
    getByUserId,
}
