const validator = require("password-validator");

const passwordSchema = new validator();

// schema du mot de passe
passwordSchema
  .is()
  .min(6) // Minimum 6 caractères
  .is()
  .max(100) // Maximum 100 caractères
  .has()
  .uppercase() // Minimum une lettre majuscule
  .has()
  .lowercase() // Minimum une lettre minuscule
  .has()
  .digits(2) // Minimum 2 chiffres
  .has()
  .not()
  .spaces() // Pas d'espace
  .is()
  .not()
  .oneOf(["Passw0rd", "Password123"]); // Blacklist

// vérification du mot de passe
module.exports = (req, res, next) => {
  if (passwordSchema.validate(req.body.password) === false) {
    return res.status(200).json({ error: "Le mot de passe est invalide" });
  } else {
    next();
  }
};
