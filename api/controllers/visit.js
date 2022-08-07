const sanitize = require('mongo-sanitize');
const Visit = require('../models/visit');

const index = async (req, res) => {
    const group = sanitize(req.query.group) ? sanitize(req.query.group) : 'date';
    const username = sanitize(req.query.username) ? sanitize(req.query.username) : false;
    const short = sanitize(req.query.short) ? sanitize(req.query.short) : false;
    let where = {};
    if(username)where['username'] = username;
    if(short)where['short'] = short;
    
    group_by = {
        date: {
            day: "$day",
            month: "$month",
            year: "$year"
        },
        month: {
            month: "$month",
            year: "$year"
        },
        year: {
            year: "$year"
        },
    };
    sort_by = {
        date: {
            "_id.year": 1,
            "_id.month": 1,
            "_id.day": 1,
        },
        month: {
            "_id.year": 1,
            "_id.month": 1,
        },
        year: {
            "_id.year": 1,
        },
    }
    pipeline =[];
    if(where)
    {
        pipeline.push(
            {
                $match: where,
            }
        );
    }
    pipeline.push(
        {
            $group: {
                _id: group_by[group],
                count: {
                        $sum: 1
                    }
            }
        }
    );

    pipeline.push(
        
        {
            $sort: sort_by[group],
        }
    );
    try {
        let sum = await Visit.aggregate(pipeline);

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
    index
}
