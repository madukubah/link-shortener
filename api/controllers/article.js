const sanitize = require('mongo-sanitize');

const Article = require('../models/article');

const create = async (req, res) => {
    try {
        return Article.create(req.body)
            .then(article => {
                res.status(201);
                res.json(article)
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
    if(search) {
        query["$or"] = [
            {
                name: new RegExp(`${search}`, 'i')
            }
        ];
    }
    let articles = await Article.paginate(query, { page: page, limit: limit })
    res.status(200);
    res.json(articles);
}

const show = (req, res) => {
    const id = req.params.articleId;
    return Article.findById(id)
        .then(article => {
            if (article) {
                res.status(200);
                res.json(article);
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
    let id = req.params.articleId;
    let newdata = req.body;
    return Article.findByIdAndUpdate(id, newdata, { runValidators: true })
        .then(result => {
            if (result) {
                return Article.findById(result._id).then(article => {
                    res.status(200);
                    res.json(article);
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
    let id = req.params.articleId;
    return Article.findByIdAndRemove(id)
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