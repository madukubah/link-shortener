const mongoose = require('mongoose');
const sanitize = require('mongo-sanitize');

const Point = require('../../models/point');

const sumOfPoint = async (req, res) => {
    try {
        const userId = req.user.id;
        let sum = await Point.aggregate(
            [
                { $match: { user_id: mongoose.Types.ObjectId(userId) }},
                {
                    $group: {
                        _id: "$user_id",
                        balance: {
                            $sum: "$amount"
                        }
                    }
                }
            ],
        );

        
        result = {
            balance: sum.length>0 ? sum[0].balance / 20000: 0
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
    sumOfPoint
}
