const sanitize = require('mongo-sanitize');
const xlxs = require('xlsx');
const fs = require('fs');
const excel = require('node-excel-export');

const Installment = require('../models/installment');
const Member = require('../models/member');

const index = async (req, res) => {
    const page = sanitize(req.query.page) ? sanitize(req.query.page) : 1
    const limit = sanitize(req.query.limit) ? sanitize(req.query.limit) : 10
    const search = req.query.search

    let query = {}
    return Installment.paginate(query, { page: page, limit: limit })
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

    const query = { member_id: id }
    return Installment.find(query)
        .then(deposits => {
            if (deposits) {
                res.status(200);
                res.json(deposits);
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

const importExcel = async (req, res) => {
    if(req.file && req.file.filename) {
        const filePath = `./uploads/excels/${req.file.filename}`
        const wbRead = xlxs.readFile(filePath)
        const sheetNameLists = wbRead.SheetNames
        const fetchData = xlxs.utils.sheet_to_json(wbRead.Sheets[sheetNameLists[0]])

        let datas = fetchData.map( (val) => {
            return {
                employee_no: val["Nomor Pegawai"],
                amount: val["Setoran"],
                is_deposit: val['Menyetor (Ya/Tidak)'],
            }
        });
        for(let i=datas.length-1; i>=0; i-- ){
            // if(datas[i]["is_deposit"] != 'ya' ){
            //     datas.splice(i, 1);
            //     continue;
            // }
            let employee = await Member.findOne({employee_no: datas[i].employee_no});
            datas[i]["member_id"] = employee._id
            datas[i]["date"] = Date.now()
        }
        // console.log(datas);
        if(fs.existsSync(filePath)) fs.unlinkSync(filePath)

        return Installment.insertMany(datas)
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
    res.status(500);
    res.json({
        errors: ["No Filename"]
    });
    return 
}

module.exports = {
    index,
    getByMemberId,
    importExcel
}
