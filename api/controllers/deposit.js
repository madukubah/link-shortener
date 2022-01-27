const sanitize = require('mongo-sanitize');
const xlxs = require('xlsx');
const fs = require('fs');
const excel = require('node-excel-export');

const Deposit = require('../models/deposit');
const Member = require('../models/member');


const create = async (req, res) => {
    try {
        const {
            member_id
        } = req.body;
        const member = await Member.findById(member_id)
        if(!member) throw new Error("No Member");

        return Deposit.create(req.body)
            .then(deposit => {
                res.status(201);
                res.json(deposit)
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
    const search = req.query.search

    let query = {}
    return Deposit.paginate(query, { page: page, limit: limit })
        .then(deposits => {
            res.status(201);
            res.json(deposits)
        })
        .catch(error => {
            res.status(422);
            res.json({
                errors: error.messages
            });
        })
}

const getByMemberId = (req, res) => {
    const id = req.params.memberId;
    const page = sanitize(req.query.page) ? sanitize(req.query.page) : 1
    const limit = sanitize(req.query.limit) ? sanitize(req.query.limit) : 10
    const status = sanitize(req.query.status)

    const query = { member_id: id }
    return Deposit.paginate(query, { page: page, limit: limit })
        .then(deposits => {
            res.status(200);
            res.json(deposits);
        })
        .catch(err => {
            res.status(500);
            res.json({
                errors: [err.message]
            });
        })
}

const getByMemberIdRangeDate = (req, res) => {
    const id = req.params.memberId;
    const page = sanitize(req.query.page) ? sanitize(req.query.page) : 1
    const limit = sanitize(req.query.limit) ? sanitize(req.query.limit) : 10
    const startDate = sanitize(req.query.startDate)
    const endDate = sanitize(req.query.endDate)

    const query = { 
        $and: [
            {member_id: id},
            {date: {$gte:new Date(startDate),$lte:new Date(endDate)}}
        ]
    }
    return Deposit.paginate(query, { page: page, limit: limit })
        .then(deposits => {
            res.status(200);
            res.json(deposits);
        })
        .catch(err => {
            res.status(500);
            res.json({
                errors: [err.message]
            });
        })
}

const unlink = (req, res) => {
    let id = req.params.depositId;
    return Deposit.findByIdAndRemove(id)
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

const importExcel = async (req, res) => {
    if(req.file && req.file.filename) {
        const filePath = `./uploads/excels/${req.file.filename}`
        const wbRead = xlxs.readFile(filePath)
        const sheetNameLists = wbRead.SheetNames
        const fetchData = xlxs.utils.sheet_to_json(wbRead.Sheets[sheetNameLists[0]])

        let datas = fetchData.map( (val) => {
            return {
                employee_no: val["KTP"],
                amount: val["Setoran"]
            }
        });
        for(let i=datas.length-1; i>=0; i-- ){
            
            let employee = await Member.findOne({id_number: datas[i].id_number});
            if( !employee ) {
                datas.splice(i, 1);
                continue;
            }
            datas[i]["member_id"] = employee._id
            datas[i]["date"] = Date.now()
        }
        console.log(datas);
        if(fs.existsSync(filePath)) fs.unlinkSync(filePath)

        return Deposit.insertMany(datas)
            .then(deposits => {
                res.status(201);
                res.json(deposits)
            })
            .catch(error => {
                res.status(422);
                res.json({
                    errors: error.message
                });
            })
    }
    res.status(500);
    res.json({
        errors: ["No Filename"]
    });
    return 
}

module.exports = {
    index,
    getByMemberId,
    importExcel,
    create,
    getByMemberIdRangeDate,
    unlink
}
