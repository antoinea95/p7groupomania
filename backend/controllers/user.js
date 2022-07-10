const User = require('../models/user');
const fs = require('fs');

//////////////////////////////////////////////////////get user
exports.getUser = (req, res) => {
    User.findOne({_id: req.params.id}).select('-password')
        .then(user => res.status(200).json(user))
        .catch(error => res.status(500).json({error}))
}

//////////////////////////////////////////////////////get all users
exports.getAllUsers = (req, res) => {
    User.find().select('-password')
        .then(users => res.status(200).json(users))
        .catch(error => res.status(500).json({error}))
}


//////////////////////////////////////////////////////update user
exports.updateUser = (req, res) => {
     // find user in DB
     User.findOne({_id: req.params.id})
     .then(user => {
         // if authentification is okay, we can update the user
        if(req.params.id === req.token.userId) {
             User.updateOne({_id: req.params.id}, {
                
                firstName: req.body.firstName,
                function: req.body.function, 
                bio: req.body.bio
            
            })
                 .then(() => res.status(200).json({message: 'User modifié!', user: user}))
                 .catch(error => res.status(400).json({error}));
         } 
         else {
            res.status(401).json({error: 'Non autorisé'});
         }
    })
     .catch(error => res.status(500).json({error}))
}

///////////////////////////////////////////////update user's picture
exports.uploadImg = (req, res) => {

        User.findOne({_id: req.params.id})
            .then(user => {
                const filename = user.imageUrl.split('/images/users/')[1];
                fs.unlink(`images/users/${filename}`, (err) => {
                    if(err) {
                        throw err;
                    }
                })

                if(req.params.id === req.token.userId ) {
                    User.updateOne({_id: req.params.id}, 
                        {imageUrl: `${req.protocol}://${req.get('host')}/images/users/${req.file.filename}`, 
                        _id: req.params.id})
                        .then(() => res.status(200).json({message: 'Post modifié!'}))
                        .catch(error => res.status(400).json({error}));
                } else {
                    res.status(401).json({error: 'Non autorisé'});
                }
                
            })
            .catch(error => res.status(500).json({error}))
};

///////////////////////////////////////////////delete user's profile
exports.deleteUser = (req, res) => {

    if(req.params.id === req.token.userId || req.token.userRole === 'admin') {
        User.deleteOne({_id: req.params.id})
            .then(() => res.status(200).json({message: 'User supprimé!'}))
            .catch(error => res.status(400).json({error}));
            
    } else {
        res.status(401).json({error: 'Non autorisé'});
    }
    
}



