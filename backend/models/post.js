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
                commenterId: String,
                commentName: String,
                text: String,
                timestamps: Number
            }
        ], require: true },
    likes: 
        {type: Number, default: 0, required: true},
    usersLiked:
        {type: [String]}
}, 
    {
        timestamps: true
    }
)

module.exports = mongoose.model('post', postSchema);