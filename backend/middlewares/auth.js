const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.cookies.jwt; // récupéatation du token
    req.token = jwt.verify(token, `${process.env.TOKEN_KEY}`); //vérification du token

    // authentification de l'utilisation si la requête contient l'userId
    if (req.body.userId && req.body.userId !== req.token.userId) {
      throw "UserId non valable";
    } else {
      next();
    }
  } catch (error) {
    res.status(403).json({ error });
  }
};
