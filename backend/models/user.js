const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const {isEmail} = require('validator')

// user's model

const userSchema = mongoose.Schema({
    email: {type: String, required: true, validate:[isEmail], unique: true},
    password: {type: String, required: true},
    firstName: {type: String, required: true},
    imageUrl: {type: String, default: './'}, // add image by default
    function: {type: String}
})

userSchema.plugin(uniqueValidator);
module.exports = mongoose.model('user', userSchema);