const sanitize = require('mongo-sanitize');

const Article = require('../../models/article');


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
    let articles = await Article.paginate({status: "publish"}, { page: page, limit: limit })
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


module.exports = {
    index,
    show,
}
