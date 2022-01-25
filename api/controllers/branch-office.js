const sanitize = require('mongo-sanitize');
const xlxs = require('xlsx');
const fs = require('fs');
const excel = require('node-excel-export');

const BranchOffice = require('../models/branch-office');


const create = async (req, res) => {
    try {
        const {
            name,
        } = req.body;
        return BranchOffice.create({
            name: name,
        })
            .then(branchOffice => {
                res.status(201);
                res.json(branchOffice)
            })
            .catch(error => {
                user.remove();
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
            },
            {
                employee_no: new RegExp(`${search}`, 'i')
            }
        ];
    }
    if(status) {
        query['status'] = status
    }
    let branchOffices = await BranchOffice.paginate(query, { page: page, limit: limit })
    res.status(200);
    res.json(branchOffices);
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
    unlink,
}
