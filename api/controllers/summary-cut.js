const sanitize = require('mongo-sanitize');
const xlxs = require('xlsx');
const fs = require('fs');
const excel = require('node-excel-export');
const mongoose = require('mongoose');

const Member = require('../models/member');
const Deposit = require('../models/deposit');
const LoanContract = require('../models/loan-contract');
const Installment = require('../models/installment');
const SaleOrder = require('../models/sale-order');
const Point = require('../models/point');


const exportExcel = async (req, res) => {
    let members = await Member.aggregate(
        [
            {
                $lookup:
                {
                    from: "loan-contracts",
                    let: { "user_id": "$user_id" },
                    as: "loan_contracts",
                    pipeline :[
                        {
                            $match: { 
                                $and:[
                                    {$expr: { $eq: ["$$user_id", "$user_id"] }},
                                    {status: 'success'}
                                ]
                            }
                        },
                    ],
                }
            },
            {
                $lookup:
                {
                    from: "sale-orders",
                    let: { "user_id": "$user_id" },
                    as: "sale_orders",
                    pipeline :[
                        {
                            $match: { 
                                $and:[
                                    {$expr: { $eq: ["$$user_id", "$user_id"] }},
                                    {status: 'process'},
                                    {payment_method: 'salary_cut'},
                                ]
                            }
                        },
                    ],
                }
            },
            {
                $project: {
                    "_id": 1,
                    "user_id": 1,
                    "name": 1,
                    "id_number": 1,
                    "employee_no": 1,
                    "email": 1,
                    "deposit_amount": 1,
                    "loan_contracts": {
                        "period": 1,
                        "amount": 1,
                        "reduced": 1,
                        "instalment_per_period": 1,
                    },
                    "sale_orders": {
                        "total_amount": 1,
                        "payment_method": 1,
                    },
                }
            }
        ],
    );

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
        _id: { 
            displayName: 'ID', 
            headerStyle: styles.headerDark, 
            width: 120 
        },
        user_id: { 
            displayName: 'USER ID', 
            headerStyle: styles.headerDark, 
            width: 120 
        },
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
    members.map(member => {
        member.loan_installment_amount = member.loan_contracts.reduce((prev, curr)=> prev + curr.instalment_per_period, 0)
        member.time_deposit = member.sale_orders.reduce((prev, curr)=> prev + curr.total_amount, 0)
        return member
    })
    const report = excel.buildExport(
        [ 
            {
                name: 'Anggota',
                specification: specification,
                data: members      
            }
        ]
    );
    
    // You can then return this straight
    res.attachment('Potongan.xlsx'); // This is sails.js specific (in general you need to set headers)
    return res.send(report);
}
const importExcel = async (req, res) => {
    if(req.file && req.file.filename) {
        try{
            const filePath = `./uploads/excels/${req.file.filename}`
            const wbRead = xlxs.readFile(filePath)
            const sheetNameLists = wbRead.SheetNames
            const fetchData = xlxs.utils.sheet_to_json(wbRead.Sheets[sheetNameLists[0]])
    
            let datas = fetchData.map( (val) => {
                return {
                    id_number: val["KTP"],
                    deposit_amount: val["Setoran Simpanan"],
                    loan_installment_amount: val["Setoran Pinjaman"],
                    credit_amount: val["Setoran Kredit"],
                    time_deposit: val["Setoran Tempo"]
                }
            });
            for(let i=datas.length-1; i>=0; i-- ){
                
                let member = await Member.findOne({id_number: datas[i].id_number});
                // deposit
                await Deposit.create({
                    member_id : member._id,
                    amount : datas[i].deposit_amount,
                    date : Date.now(),
                })
            }
    
    
            // loan
            let userIds = fetchData.map(val => val["USER ID"] )
            let loanContracts = await LoanContract.
                                find(
                                    {
                                        $and : [
                                            {"user_id" : { $in : userIds}},
                                            {status: 'success'}
                                        ]
                                    }
                                )
            for(let i=loanContracts.length-1; i>=0; i-- ){
    
                await Installment.create({
                    contract_id : loanContracts[i]._id,
                    amount : loanContracts[i].instalment_per_period,
                    date : Date.now(),
                })
    
                let installmentAmount = await Installment.aggregate([
                    {$match : { contract_id : mongoose.Types.ObjectId(loanContracts[i]._id) }},
                    {
                        $group : {
                            _id : null,
                            total : {
                                $sum : "$amount"
                            }
                        }
                    }
                ])
                if(installmentAmount){
                    let loanAmount = loanContracts[i].amount - loanContracts[i].reduced
                    if( (loanAmount - 1) <= installmentAmount[0].total )
                    {
                        loanContracts[i].status = 'done'
                        await loanContracts[i].save()
                    }
                }
            }

            //sale
            let sale_orders = await SaleOrder.find(
                    {
                        $and : [
                            {"user_id" : { $in : userIds}},
                            {status: 'process'},
                            {payment_method: 'salary_cut'},
                        ]
                    }
                )
                
            for(let i=sale_orders.length-1; i>=0; i-- ){
            
                let point = await Point.findOne({user_id: sale_orders[i].user_id});
                if(point){
                    point.amount = point.amount + sale_orders[i].total_amount
                    await point.save()
                }else{
                    await Point.create({
                        user_id: sale_orders[i].user_id,
                        amount : sale_orders[i].total_amount,
                    })
                }
            }

            await SaleOrder.updateMany(
                    {
                        $and : [
                            {"user_id" : { $in : userIds}},
                            {status: 'process'},
                            {payment_method: 'salary_cut'},
                        ]
                    }, 
                    { status: 'done' }, 
                    { runValidators: true }
                )
            res.status(201);
            res.json({
                message: "success"
            })
            return ;
        }catch (err) {
            res.status(500);
            res.json({
                errors: [err.message]
            });
            return;
        }
        
    }
    res.status(500);
    res.json({
        errors: ["No Filename"]
    });
    return 
}

module.exports = {
    importExcel,
    exportExcel
}
