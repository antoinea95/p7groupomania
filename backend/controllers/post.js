const Post = require('../models/post');
const fs = require('fs');


/////////////////////////////////////////////create post
exports.createPost = (req, res) => {

    // if request have a file we need to parse request's body
    const post =  new Post( req.file ? 
        {
            ...JSON.parse(req.body.post), 
            imageUrl: `${req.protocol}://${req.get('host')}/images/posts/${req.file.filename}`
        } : 
        
        {
            userId: req.body.userId,
            message: req.body.message,
            imageUrl: '',
            comments: [],
            likes: 0,
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

/////////////////////////////////////////////get all post
exports.getAllPosts = (req, res) => {
    Post.find()
        .then(posts => res.status(200).json(posts))
        .catch(error => res.status(400).json({error}))
}

/////////////////////////////////////////////get post
exports.getOnePost = (req, res) => {

    Post.findOne({_id: req.params.id})
        .then(posts => res.status(200).json(posts))
        .catch(error => res.status(400).json({error}))
}



/////////////////////////////////////////////update post
exports.updatePost = (req, res) => {

    // delete old image if request contain a new one
    if(req.file) { 
        Post.findOne({_id: req.params.id})
            .then(post => {
                const filename = post.imageUrl.split('/images/posts/')[1];
                fs.unlink(`images/posts/${filename}`, (err) => {
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
                imageUrl: `${req.protocol}://${req.get('host')}/images/posts/${req.file.filename}`
            } : {...req.body};

            // if authentification is okay, we can update the post
            if(post.userId === req.token.userId || req.token.userRole === 'admin') {
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

    Post.findOne({_id: req.params.id})
        .then(post => {

            if(post.userId === req.token.userId || req.token.userRole === 'admin') {
                const filename = post.imageUrl.split('/images/posts')[1];
                fs.unlink(`images/posts/${filename}`, () => {
                    Post.deleteOne({_id: req.params.id})
                        .then(() => res.status(200).json({message: 'Post supprimé'}))
                        .catch(error => res.status(400).json({error}))  
                })
            }

             else {
                res.status(401).json({error: 'Non autorisé'});
            }
        })
        .catch(error => res.status(500).json({error}))
};


/////////////////////////////////////////////like post
exports.likePost = (req, res) => {
    Post.findOne({_id: req.params.id})
        .then(post => {

            const userId = req.body.userId;
            const like = req.body.like;

            const likeId = post.usersLiked.includes(userId);

            switch(true) {

                case like !== 0 && like !== 1:
                   res.status(403).json({message: 'Non autorisé'});
                    break;

                case like === 1 && likeId:
                    res.status(403).json({message: 'Non autorisé'});
                    break;
                    
                case like === 1 && likeId === false:
                    Post.updateOne({_id: req.params.id}, {$inc:{likes: +1}, $push:{usersLiked:userId}})
                    .then(() => res.status(200).json({message: 'like envoyé'}))
                    .catch(error => res.status(400).json({error}));
                    break;

                case like === 0 && likeId:
                    Post.updateOne({_id: req.params.id}, {$inc:{likes: -1}, $pull:{usersLiked:userId}})
                     
                    break;
            }
        })
        .catch(error => res.status(400).json({error}));
}



