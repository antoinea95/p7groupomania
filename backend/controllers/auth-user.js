// import security's packages
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cryptoJs = require('crypto-js');
const cookie = require('cookie-parser');

// import user's schema
const User = require('../models/user');
const { signupErrors } = require('../utils/error');



exports.signup = (req, res) => {

    // hash password
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User ({
                email: cryptoJs.HmacSHA256(req.body.email, process.env.EMAIL_KEY).toString(),
                password: hash,
                firstName: req.body.firstName, 
                imageUrl: `${req.protocol}://${req.get('host')}/images/users/defaultpicture.svg`
            });

            // save new user in db
            user.save()
                .then(() => res.status(201).json({message: 'utilisateur crée'}))
                .catch(error =>  

                {const errors = signupErrors(error)
                res.status(200).send({errors})})
            })
        .catch(error => res.status.json({error}));
};

exports.login = (req, res) => {

    // crypt email in DB
    const emailCrypt = cryptoJs.HmacSHA256(req.body.email, process.env.EMAIL_KEY).toString();
    
    // find user with crypted email
    User.findOne({email: emailCrypt})
        .then (user => {
            if(!user) {
                return res.status(200).send({message: 'Aucun compte associé à cet email'});
            }

            // compare password with bcrypt
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if(!valid) {
                        return res.status(200).send({message: 'Le mot de passe est incorrect'})
                    }

                    // if password is ok, return user Id + token in response body
                
                       const token = jwt.sign(
                            {userId: user._id, userRole: user.role},
                            process.env.TOKEN_KEY, 
                            {expiresIn: '24h'})
                   

                        return res.cookie('jwt', token, {httpOnly: true})
                        .status(200)
                        .json({userId: user._id, token: token})
                    
                    
                })
                .catch(error => res.status(500).json({error}))
        })
        .catch(error => res.status(500).json({error}))
};

exports.logout = (req, res) => {
    res.clearCookie('jwt');
    res.redirect('/');
}


exports.getToken = (req, res) => {

    const token = req.cookies.jwt;
    if(token) {
    // get token
    const decodedToken = jwt.verify(token, `${process.env.TOKEN_KEY}`)
    const userId = decodedToken.userId
    return res.status(200).json({userId: userId})

    } else {
        return res.status(403).json({message: 'No token '})
    }
   
}

