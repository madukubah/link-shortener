const sanitize = require('mongo-sanitize');
var os = require("os");
const Link = require('../models/link');
const Visit = require('../models/visit');

const create = async (req, res) => {
    try {
        let short = (""+Date.now());
        short = short.substring(short.length - 6);
        req.body.host = req.headers.host+'/';
        req.body.short = Buffer.from(short).toString('base64');
        return Link.create(req.body)
            .then(link => {
                res.status(201);
                res.json(link)
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
    const username = sanitize(req.query.username) ? sanitize(req.query.username) : false;
    let where = {};
    if(username)
    {
        where['username'] = username;
    }
    let links = await Link.paginate(where, { page: page, limit: limit })
    links.docs = links.docs.map((item)=> {
        let temp = {
            host_short: item.host+item.short,
            username: item.username,
            redirect: item.redirect,
            host: item.host,
            short: item.short,
            _id: item._id,
        };
        return temp;
    })
    res.status(200);
    res.json(links);
}

const show = (req, res) => {
    const id = req.params.linkId;
    return Link.findById(id)
        .then(link => {
            if (link) {
                res.status(200);
                res.json(link);
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
    let id = req.params.linkId;
    let newdata = req.body;
    return Link.findByIdAndUpdate(id, newdata, { runValidators: true })
        .then(result => {
            if (result) {
                return Link.findById(result._id).then(link => {
                    res.status(200);
                    res.json(link);
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
    let id = req.params.linkId;
    return Link.findByIdAndRemove(id)
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


const short = (req, res) => {
    const short = req.params.short;
    return Link.findOne({short: short})
        .then(link => {
            if (link) {
                let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress ;
                return Visit.findOne({short:link.short, ip: ip})
                .then( result =>{
                    if (result) {
                        res.redirect(link.redirect);
                        
                    }
                    else {
                        return Visit.create({username: link.username, short:link.short, host:link.host, ip: ip})
                        .then(_ => {
                            res.redirect(link.redirect);
                        })
                    }
                })
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
module.exports = {
    create,
    index,
    show,
    update,
    unlink,
    short
}
