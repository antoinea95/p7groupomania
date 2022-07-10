// import security's packages
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cryptoJs = require('crypto-js');

// import user's schema
const User = require('../models/user');



exports.signup = (req, res) => {

    // crypt email in DB
    const emailCrypt = cryptoJs.HmacSHA256(req.body.email, process.env.EMAIL_KEY).toString();

    // hash password
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User ({
                email: emailCrypt, 
                password: hash,
                firstName: req.body.firstName
            });

            // save new user in db
            user.save()
                .then(() => res.status(201).json({message: 'utilisateur crée'}))
                .catch(error => res.status(500).json({error}))
            })
        .catch(error => res.status(500).json({error}));
};

exports.login = (req, res) => {

    // crypt email in DB
    const emailCrypt = cryptoJs.HmacSHA256(req.body.email, process.env.EMAIL_KEY).toString();
    
    // find user with crypted email
    User.findOne({email: emailCrypt})
        .then (user => {
            if(!user) {
                return res.status(401).json({message: 'utilisateur non trouvé'});
            }

            // compare password with bcrypt
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if(!valid) {
                        return res.status(401).json({error: 'mot de passe incorrect'})
                    }

                    // if password is ok, return user Id + token in response body
                    return res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            {userId: user._id, userRole: user.role},
                            process.env.TOKEN_KEY, 
                            {expiresIn: '24h'}
                        )
                    })
                })
                .catch(error => res.status(500).json({error}))
        })
        .catch(error => res.status(500).json({error}))
};

