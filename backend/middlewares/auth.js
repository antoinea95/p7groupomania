const jwt = require('jsonwebtoken');


module.exports = (req, res, next) => {

    try {
        const token = req.headers.authorization.split(' ')[1]; // get token
        req.token = jwt.verify(token, `${process.env.TOKEN_KEY}`) // decrypt & verify token

        // authentification with userId
        if(req.body.userId && req.body.userId !== req.token.userId) {
            throw 'UserId non valable';
        } else {
            next()
        }
    }

    catch (error) {
        res.status(403).json({error: req.token | 'Requête non autorisée'});
    }
};