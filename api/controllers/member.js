const sanitize = require('mongo-sanitize');
const xlxs = require('xlsx');
const fs = require('fs');
const excel = require('node-excel-export');

const Member = require('../models/member');
const User = require('../models/user');

const create = async (req, res) => {
    try {
        const {
            name,
            id_number,
            employee_no,
            email,
            phone,
            company_name,
            branch_name,
            city,
            join_date,
            end_date,
            salary,
            deposit_amount,
            total_savings,
            savings_type,
            status,
        } = req.body;
        const user = await User.create({
            username: email,
            password: email.substr(0, email.indexOf("@")),
            pin: "123456"
        })
        return Member.create({
            name: name,
            id_number: id_number,
            user_id: user._id,
            employee_no: employee_no,
            email: email,
            phone: phone,
            company_name: company_name,
            branch_name: branch_name,
            city: city,
            join_date: join_date,
            end_date: end_date,
            salary: salary,
            deposit_amount: deposit_amount,
            total_savings: total_savings,
            savings_type: savings_type,
            status: status,
        })
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
    query.softDelete = null
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
    return Member.paginate(query, { page: page, limit: limit })
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
    return Member.findById(id)
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

const update = (req, res) => {
    let id = req.params.memberId;
    let newdata = req.body;
    return Member.findByIdAndUpdate(id, newdata, { runValidators: true })
        .then(result => {
            if (result) {
                return Member.findById(result._id).then(member => {
                    res.status(200);
                    res.json(member);
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
                total_savings: val["total simpanan"],
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
