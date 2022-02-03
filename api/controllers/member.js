const sanitize = require('mongo-sanitize');
const xlxs = require('xlsx');
const fs = require('fs');
const excel = require('node-excel-export');
const mongoose = require('mongoose');

const Member = require('../models/member');
const User = require('../models/user');
const Deposit = require('../models/deposit');
const BranchOffice = require('../models/branch-office');
const Province = require('../models/province');
const City = require('../models/city');

const serialize = (data) => {
    return {
        _id: data._id? data._id: null,
        name: data.name? data.name: null,
        id_number: data.id_number? data.id_number : null,
        user_id: data.user_id?data.user_id:null,
        employee_no: data.employee_no? data.employee_no: null,
        email: data.email? data.email: null,
        phone: data.phone? data.phone: null,

        branch: data.branch? data.branch: null,
        
        join_date: data.join_date? data.join_date: "",
        end_date: data.end_date? data.end_date: "",
        
        salary: data.salary? data.salary: 0,
        deposit_amount: data.deposit_amount? data.deposit_amount: 0,

        total_deposits: data.total_deposits? data.total_deposits: 0,

        savings_type: data.savings_type? data.savings_type: "",
        status: data.status? data.status: null,
    }
}

const create = async (req, res) => {
    try {
        const {
            email,
            branch_id,
        } = req.body;
        const branchOffice = await BranchOffice.findById(branch_id)
        if(!branchOffice) throw new Error("No Branch Office");

        const user = await User.create({
            username: email,
            password: email.substr(0, email.indexOf("@")),
            pin: "123456"
        })
        req.body["user_id"] = user._id;
        return Member.create(req.body)
            .then(member => {
                res.status(201);
                res.json(member)
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
    let members = await Member.paginate(query, { page: page, limit: limit })
    for(let i=0; i< members.docs.length; i++ ){
        let deposits = await Deposit.find({member_id: members.docs[i]._id })
        members.docs[i].total_deposits = deposits.reduce((prev, current)=> prev + current.amount, 0);

        members.docs[i].branch = await BranchOffice.findById(members.docs[i].branch_id)
    }
    members.docs = members.docs.map( el => serialize(el) )
    res.status(201);
    res.json(members);
}

const show = (req, res) => {
    const id = req.params.memberId;
    return Member.findById(id)
        .then(member => {
            if (member) {
                res.status(200);
                res.json(serialize(member));
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
    let id = req.params.memberId;
    let newdata = req.body;
    return Member.findByIdAndUpdate(id, newdata, { runValidators: true })
        .then(result => {
            if (result) {
                return Member.findById(result._id).then(member => {
                    res.status(200);
                    res.json(serialize(member));
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
    let id = req.params.memberId;
    if (id == req.user.id) {
        res.status(422);
        res.json({
            errors: ["Cannot delete your own data"]
        });
        return;
    }
    return Member.findByIdAndRemove(id)
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
                name: val["nama"],
                employee_no: val["nomor pegawai"],
                email: val["email"],
                phone: val["nomor telepon"],
                company_name: val["perusahaan"],
                branch_name: val["cabang"],
                city: val["kota"],
                join_date: val["Tanggal bergabung"],
                salary: val["gaji pokok"],
                deposit_amount: val["setoran"],
                savings_type: val["tipe simpanan"],
                status: val["status"] == 'aktif' ? 'active': 'nonactive' ,
            }
        });
        console.log(datas);
        for(let i=0; i< datas.length; i++ ){
            let email = datas[i].email;
            let user = await User.create({
                username: email,
                password: email.substr(0, email.indexOf("@")),
                pin: "123456"
            })
            datas[i].user_id = user._id;
        }

        if(fs.existsSync(filePath)) fs.unlinkSync(filePath)

        return Member.insertMany(datas)
            .then(members => {
                res.status(201);
                res.json(members)
            })
            .catch(error => {
                res.status(422);
                res.json({
                    errors: [error.message]
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
        id_number: { 
            displayName: 'KTP', 
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
            displayName: 'Setoran Simpanan', 
            headerStyle: styles.headerDark, 
            width: 120 
        },
        loan_installment_amount: { 
            displayName: 'Setoran Pinjaman', 
            headerStyle: styles.headerDark, 
            width: 120 
        },
        credit_amount: { 
            displayName: 'Setoran Kredit', 
            headerStyle: styles.headerDark, 
            width: 120 
        },
        time_deposit: { 
            displayName: 'Setoran Tempo', 
            headerStyle: styles.headerDark, 
            width: 120 
        },
    }
    const dataset = await Member.find(
        {status: "active"}
    );
    
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
    create,
    index,
    show,
    update,
    unlink,
    importExcel,
    exportExcel
}
