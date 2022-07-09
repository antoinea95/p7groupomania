const Post = require('../models/post');

//////////////////////////////////////////create comment
exports.createComment = (req, res) => {
    Post.findOne({_id: req.params.id})
        .then(post => {

            // update post and push the new comment in comment's array
            Post.updateOne({_id: req.params.id}, {$push:
                {
                    comments: {
                        commenterId: req.body.userId,
                        commentName: req.body.commentName,
                        text: req.body.text,
                        timestamp: new Date().getTime(),
                    }
                } 
            }) 
            .then(() => res.status(200).json({message: post}))
            .catch(error => res.status(400).json({error}));  
        })
        .catch(error => res.status(500).json({error}))
}

//////////////////////////////////////////update comment
exports.updateComment = (req, res) => {
    Post.findOne({_id: req.params.id})
        .then( post => {

            // find comment and update text
            const updateComment = post.comments.find((comment) => comment._id.equals(req.body.commentId))
            updateComment.text = req.body.text;

            // filter the old comments of comments's array and push the new one
            const newComments = post.comments.filter((comments) => comments._id !== updateComment._id)
            newComments.push(updateComment);

            // if userId is equal to the commenterId update post
            if(updateComment.commenterId === req.token.userId) {

                Post.updateOne({_id: req.params.id}, {comments: newComments})
                    .then(() => res.status(200).json({message: 'commentaires modifié!'}))
                    .catch(error => res.status(400).json({error})); 
            }  else {
                return res.status(403).json({message: 'Non autorisé'});
            }

        })
        .catch(error => res.status(500).json({error}));
}


//////////////////////////////////////////delete comment
exports.deleteComment = (req, res) => {
    Post.findOne({_id:req.params.id})
        .then(post => {

            // find comment to delete
            const updateComment = post.comments.find((comment) => comment._id.equals(req.body.commentId));

            //create a new comments's array without the comment
            const newComments = post.comments.filter((comments) => comments._id !== updateComment._id);

            // If userId is equal to commenterId update post
            if(updateComment.commenterId === req.token.userId) {
            
                Post.updateOne({_id: req.params.id}, {comments: newComments})
                    .then(() => res.status(200).json({message: 'commentaires supprimé!'}))
                    .catch(error => res.status(400).json({error})); 
            }  
            else {
                return res.status(403).json({message: 'Non autorisé'});
            }

        })
        .catch(error => res.status(500).json({error}));
}
