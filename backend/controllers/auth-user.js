// import des paquets de sécurité
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// import des modèles de donnée
const User = require("../models/user");
const { signupErrors } = require("../utils/error");

exports.signup = (req, res) => {
  //hash du password pour qu'il ne soit pas accessible dans la base de donnée
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        // email crypté à l'aide de cryptoJs
        email: req.body.email,
        password: hash,
        firstName: req.body.firstName,
        imageUrl: `${req.protocol}://${req.get(
          "host"
        )}/images/users/defaultpicture.svg`,
      });

      // une fois le hash effectué, utilisation de la méthode mongoose 'save' pour enregistrer le nouvel utilisateur
      user
        .save()
        .then(() => res.status(201).json({ message: "utilisateur crée" }))
        .catch((error) => {
          const errors = signupErrors(error);
          res.status(200).send({ errors });
        });
    })
    .catch((error) => res.status.json({ error }));
};

exports.login = (req, res) => {

  // Méthode 'findOne' qui nous permet de retrouver l'utilisateur dans la BD à l'aide de son mail unique
  User.findOne({ email: req.body.email})
    .then((user) => {
      if (!user) {
        return res
          .status(200)
          .send({ message: "Aucun compte associé à cet email" });
      }

      // Vérification du mot de passe à l'aide de bcrypt et la méthode compare
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res
              .status(200)
              .send({ message: "Le mot de passe est incorrect" });
          }

          // Si le mot de passe est bon, génération d'un token jwt qui contiendre l'userId et le rôle de l'utilisateur
          const token = jwt.sign(
            { userId: user._id, userRole: user.role },
            process.env.TOKEN_KEY,
            { expiresIn: "24h" }
          );

          return res
            .cookie("jwt", token, { httpOnly: true }) // la fonction retourne un cookie qui nous permettre de conserver la session de l'utilisateur active
            .status(200)
            .json("Utilisateur connecté");
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

// fonction de déconnextion : suppression du cookie et redirection
exports.logout = (req, res) => {
  res.clearCookie("jwt");
  res.redirect("/");
};

// rout pour récupérer le token et décrypter l'userId et le rôle de l'utilisateur
exports.getToken = (req, res) => {
  const token = req.cookies.jwt;

  // si le token est présent, vérification du token puis décryptage des données
  if (token) {
    try {
      const decodedToken = jwt.verify(token, `${process.env.TOKEN_KEY}`);
      const userId = decodedToken.userId;
      const userRole = decodedToken.userRole;
      return res.status(200).json({ userId: userId, userRole: userRole });
    } catch {
      res.status(403).json({ error: "Token non valide" });
    }
  } else {
    return res.status(403).json({ message: "No token " });
  }
};
