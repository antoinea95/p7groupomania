 
 module.exports.signupErrors = (err) => {
    let errors = {
        email: '', 
        password: '',
        firstName: ''
    }

    if(err.message.includes('email')) {
        errors.email = "Votre email est incorrect ou déjà utilisé"
    }

    return errors
 }

