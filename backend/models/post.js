const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    userId: 
        {type: String, require: true},
    message: 
        {type: String, require: true, maxlength: 1024},
    imageUrl: 
        {type: String},
    comments: 
        {type: [
            {
                usersCommented: String,
                commentsName: String,
                text: String,
                timestamp: Number
            }
        ], require: true },
    likes: 
        {type: Number},
    usersLiked:
        [String]
}, 
    {
        timestamps: true
    }
)

module.exports = mongoose.model('post', postSchema);