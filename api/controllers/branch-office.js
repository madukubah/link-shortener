const sanitize = require('mongo-sanitize');

const BranchOffice = require('../models/branch-office');
const Province = require('../models/province');
const City = require('../models/city');

const create = async (req, res) => {
    try {
        const {
            province_id,
            city_id,
        } = req.body;
        
        const province = await Province.findById(province_id)
        if(!province) throw new Error("No province");

        const city = await City.findById(city_id)
        if(!city) throw new Error("No city");

        return BranchOffice.create(req.body)
            .then(branchOffice => {
                res.status(201);
                res.json(branchOffice)
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
    if(search) {
        query["$or"] = [
            {
                name: new RegExp(`${search}`, 'i')
            }
        ];
    }

    // let branchOffices = await BranchOffice.paginate(query, { page: page, limit: limit })
    // res.status(200);
    // res.json(branchOffices);
    let branchOfficeAggregate = BranchOffice.aggregate([
        {$match: query} ,
        {
            $lookup:
            {
                from: "provinces",
                localField: "province_id",
                foreignField: "_id",
                as: "province"
            }
        },
        { $unwind: "$province" },
        {
            $lookup:
            {
                from: "cities",
                localField: "city_id",
                foreignField: "_id",
                as: "city"
            }
        },
        { $unwind: "$city" },
        
    ]);

    return BranchOffice.aggregatePaginate(branchOfficeAggregate, { page: page, limit: limit })
        .then(branchOffices => {
            res.status(200);
            res.json(branchOffices)
        })
        .catch(error => {
            res.status(422);
            res.json({
                errors: [error.messages]
            });
        })
}

const show = (req, res) => {
    const id = req.params.branchOfficeId;
    return BranchOffice.findById(id)
        .then(branchOffice => {
            if (branchOffice) {
                res.status(200);
                res.json(branchOffice);
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

const update = (req, res) => {
    let id = req.params.branchOfficeId;
    let newdata = req.body;
    return BranchOffice.findByIdAndUpdate(id, newdata, { runValidators: true })
        .then(result => {
            if (result) {
                return BranchOffice.findById(result._id).then(branchOffice => {
                    res.status(200);
                    res.json(branchOffice);
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
    return BranchOffice.findByIdAndRemove(id)
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
