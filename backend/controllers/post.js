const Post = require('../models/post');
const fs = require('fs');
const { STATUS_CODES } = require('http');


/////////////////////////////////////////////create post
exports.createPost = (req, res) => {

    // if request have a file we need to parse request's body
    const post =  new Post( req.file ? 
        {
            ...JSON.parse(req.body.post), 
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : 
        
        {
            userId: req.body.userId,
            message: req.body.message,
            imageUrl: '',
            comments: [],
            usersLiked: [],

        })

        if(post.userId === req.token.userId) {
            post.save()
                .then(() => res.status(201).json({message: 'post créé !'}))
                .catch(error => res.status(400).json({error}))
        } else {
            res.status(401).json({error:'utilisateur non valable'})
        }
    
    };

/////////////////////////////////////////////get post
exports.getAllPosts = (req, res) => {
    Post.find()
        .then(posts => res.status(200).json(posts))
        .catch(error => res.status(400).json({error}))
}

/////////////////////////////////////////////update post
exports.updatePost = (req, res) => {

    // delete old image if request contain a new one
    if(req.file) { 
        Post.findOne({_id: req.params.id})
            .then(post => {
                const filename = sauce.imageUrl.split('/images')[1];
                fs.unlink(`images/resized/${filename}`, (err) => {
                    if(err) {
                        throw err;
                    }
                })
            })
            .catch(error => res.status(500).json({error}))
    }

    // find post in DB
    Post.findOne({_id: req.params.id})
        .then(post => {
            //find object if there's a file or not in the request
            const postObject = req.file ? 
            {
                ...JSON.parse(req.body.post),
                imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
            } : {...req.body};

            // if authentification is okay, we can update the post
            if(post.userId === req.token.userId) {
                Post.updateOne({_id: req.params.id}, {...postObject, _id: req.params.id})
                    .then(() => res.status(200).json({message: 'Post modifié!'}))
                    .catch(error => res.status(400).json({error}));
            } else {
                res.status(401).json({error: 'Non autorisé'});
            }
        })
        .catch(error => res.status(500).json({error}))
};

/////////////////////////////////////////////delete post
exports.deletePost = (req, res) => {

    if(req.file) { 
        Post.findOne({_id: req.params.id})
            .then(post => {
                const filename = sauce.imageUrl.split('/images')[1];
                fs.unlink(`images/resized/${filename}`, (err) => {
                    if(err) {
                        throw err;
                    }
                })
            })
            .catch(error => res.status(500).json({error}))
    }

    Post.findOne({_id: req.params.id})
        .then(post => {

            if(post.userId === req.token.userId) {
            //     const filename = post.imageUrl.split('/resized')[1];
            //     fs.unlink(`images/resized/${filename}`, (error) => {
            //         if(error) {
            //             throw error
            //         }
            // })
            Post.deleteOne({_id: req.params.id})
                .then(() => res.status(200).json({message: 'Post supprimé'}))
                .catch(error => res.status(400).json({error}))
            }

             else {
                res.status(401).json({error: 'Non autorisé'});
            }
        })
        .catch(error => res.status(500).json({error}))
}


