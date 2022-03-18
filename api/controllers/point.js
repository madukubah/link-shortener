const mongoose = require('mongoose');
const sanitize = require('mongo-sanitize');

const Point = require('../models/point');

const create = async (req, res) => {
    try {
        return Point.create(req.body)
            .then(point => {
                res.status(201);
                res.json(point)
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
    const status = sanitize(req.query.status)
    const search = req.query.search

    let query = {}

    let pointAggregate = Point.aggregate([
        {$match: query} ,
        {
            $lookup:
            {
                from: "users",
                as: "user",
                let: { "user_id": "$user_id" },
                pipeline :[
                    {
                        $match: { 
                            $expr: { $eq: ["$$user_id", "$_id"] }
                        }
                    },
                    {
                        
                        $lookup:
                        {
                            from: "members",
                            localField: "_id",
                            foreignField: "user_id",
                            as: "member",

                        }       
                    },
                    { $unwind: "$member" },
                ],
            }
        },
        { $unwind: "$user" },
    ]);
    
    return Point.aggregatePaginate(pointAggregate, { page: page, limit: limit })
        .then(points => {
            res.status(200);
            res.json(points)
        })
        .catch(error => {
            res.status(422);
            res.json({
                errors: [error.message]
            });
        })
}

const show = async (req, res) => {
    const id = req.params.pointId;
    let pointAggregate = await Point.aggregate([
        {$match: {_id : mongoose.Types.ObjectId(id) }},
        {
            $lookup:
            {
                from: "users",
                as: "user",
                let: { "user_id": "$user_id" },
                pipeline :[
                    {
                        $match: { 
                            $expr: { $eq: ["$$user_id", "$_id"] }
                        }
                    },
                    {
                        
                        $lookup:
                        {
                            from: "members",
                            localField: "_id",
                            foreignField: "user_id",
                            as: "member",

                        }       
                    },
                    { $unwind: "$member" },
                ],
            }
        },
        { $unwind: "$user" },
    ]);

    res.status(200);
    res.json(pointAggregate.length > 0 ? pointAggregate[0] : {} );
    return
}

const update = (req, res) => {
    let id = req.params.pointId;
    let newdata = req.body;
    return Point.findByIdAndUpdate(id, newdata, { runValidators: true })
        .then(result => {
            if (result) {
                return Point.findById(result._id).then(point => {
                    res.status(200);
                    res.json(point);
                });
            }
            else {
                res.status(404);
                res.json({
                    errors: ["Not Found"]
                });
            }
        })
        .catch(error => {
            res.status(422);
            res.json({
                errors: [error.message]
            });
        })
}

const unlink = (req, res) => {
    let id = req.params.branchOfficeId;
    return Point.findByIdAndRemove(id)
        .then(_ => {
            res.status(200);
            res.json({
                message: "successfully deleted"
            });
        })
        .catch(err => {
            res.status(422);
            res.json({
                errors: [err.message]
            });
        })
}

module.exports = {
    create,
    index,
    show,
    update,
    unlink
}
