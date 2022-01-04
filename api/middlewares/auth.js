const jwt = require('jsonwebtoken');

const getToken = (req) => {
    const toRemove = 'bearer ';
    let authorization = req.get('authorization');
    if (!authorization) return null;
    return authorization.slice(toRemove.length);
}

const auth = (req, res, next) => {
    const token = getToken(req);

    if (!token) {
        return res.status(403).json({
            errors: ["A token is required for authentication"]
        });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.user = decoded;
        next();
    } catch (err) {
        if (err) {
            res.status(401);
            res.json({
                errors: ['please re-login']
            });
            return;
        }
    }
}

module.exports = auth;
