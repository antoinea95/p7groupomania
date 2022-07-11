const validator = require('password-validator');

const passwordSchema = new validator();

// schema du password
passwordSchema
.is().min(6)                                    // Minimum length 6
.is().max(100)                                  // Maximum length 100
.has().uppercase()                              // Must have uppercase letters
.has().lowercase()                              // Must have lowercase letters
.has().digits(2)                                // Must have at least 2 digits
.has().not().spaces()                           // Should not have spaces
.is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values

// vérification
module.exports = (req, res, next) => {
    if(passwordSchema.validate(req.body.password) === false) {
        return res.status(200).json({error: 'Le mot de passe est invalide'});
    }
    else {
        next();
    }
};