const jwt = require('jsonwebtoken');


module.exports = (req, res, next) => {

    try {
        const token = req.cookies.jwt; // get token
        jwt.verify(token, `${process.env.TOKEN_KEY}`) // decrypt & verify token

        // authentification with userId
        if(req.body.userId && req.body.userId !== token.userId) {
            throw 'UserId non valable';
        } else {
            next()
        }
    }

    catch (error) {
        res.status(403).json({error});
    }
};