const sanitize = require('mongo-sanitize');
const xlxs = require('xlsx');
const fs = require('fs');
const excel = require('node-excel-export');

const Deposit = require('../models/deposit');
const Member = require('../models/member');

const index = async (req, res) => {
    const page = sanitize(req.query.page) ? sanitize(req.query.page) : 1
    const limit = sanitize(req.query.limit) ? sanitize(req.query.limit) : 10
    const search = req.query.search

    let query = {}
    query.softDelete = null
    if(search) {
        query["$or"] = [
            {
                name: new RegExp(`${search}`, 'i')
            },
            {
                employee_no: new RegExp(`${search}`, 'i')
            }
        ]
    }
    return Deposit.paginate(query, { page: page, limit: limit })
        .then(members => {
            res.status(201);
            res.json(members)
        })
        .catch(error => {
            res.status(422);
            res.json({
                errors: error.messages
            });
        })
}

const show = (req, res) => {
    const id = req.params.memberId;
    return Deposit.findById(id)
        .then(member => {
            if (member) {
                res.status(200);
                res.json(member);
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
            // let employee = await Member.find({employee_no: val["Nomor Pegawai"]});

            return {
                // employee_id: employee._id,
                employee_no: val["Nomor Pegawai"],
                amount: val["Setoran"],
                is_deposit: val['Menyetor (Ya/Tidak)'],
            }
        });
        for(let i=datas.length-1; i>=0; i-- ){
            if(datas[i]["is_deposit"] != 'ya' ){
                datas.splice(i, 1);
                continue;
            }
            let employee = await Member.findOne({employee_no: datas[i].employee_no});
            datas[i]["employee_id"] = employee._id
            datas[i]["date"] = Date.now()
        }
        // console.log(datas);
        if(fs.existsSync(filePath)) fs.unlinkSync(filePath)

        return Deposit.insertMany(datas)
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

const exportExcel = async (req, res) => {
    // You can define styles as json object
    const styles = {
        headerDark: {
            font: {
                color: {
                    rgb: '00000000'
                },
                sz: 12,
            }
        },
    };
    
    //Here you specify the export structure
    const specification = {
        name: { 
            displayName: 'Nama', 
            headerStyle: styles.headerDark, 
            width: 120 
        },
        employee_no: { 
            displayName: 'Nomor Pegawai', 
            headerStyle: styles.headerDark, 
            width: 120 
        },
        email: { 
            displayName: 'Email', 
            headerStyle: styles.headerDark, 
            width: 120 
        },
        phone: { 
            displayName: 'Nomor Telepon', 
            headerStyle: styles.headerDark, 
            width: 120 
        },
        join_date: { 
            displayName: 'Tanggal bergabung', 
            headerStyle: styles.headerDark, 
            width: 120 
        },
        company_name: { 
            displayName: 'Perusahaan', 
            headerStyle: styles.headerDark, 
            width: 120 
        },
        branch_name: { 
            displayName: 'Cabang', 
            headerStyle: styles.headerDark, 
            width: 120 
        },
        city: { 
            displayName: 'Kota', 
            headerStyle: styles.headerDark, 
            width: 120 
        },
        deposit_amount: { 
            displayName: 'Setoran', 
            headerStyle: styles.headerDark, 
            width: 120 
        },
        status: { 
            displayName: 'Status', 
            headerStyle: styles.headerDark, 
            width: 120 
        },
        is_deposit: { 
            displayName: 'Menyetor (Ya/Tidak)', 
            headerStyle: styles.headerDark, 
            width: 120 
        },
    }
    const dataset = await Member.find();
    
    const report = excel.buildExport(
        [ 
            {
                name: 'Anggota',
                specification: specification,
                data: dataset
            }
        ]
    );
    
    // You can then return this straight
    res.attachment('Anggota.xlsx'); // This is sails.js specific (in general you need to set headers)
    return res.send(report);
}

module.exports = {
    index,
    show,
    importExcel,
    exportExcel
}
