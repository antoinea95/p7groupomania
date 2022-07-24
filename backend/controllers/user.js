const User = require("../models/user");
const fs = require("fs");
const cookie = require("cookie-parser");

//////////////////////////////////////////////////////get user
exports.getUser = (req, res) => {
  User.findOne({ _id: req.params.id })
    .select("-password") // on retire la clef password lors de la requête
    .then((user) => res.status(200).json(user))
    .catch((error) => res.status(500).json({ error }));
};

//////////////////////////////////////////////////////get all users
exports.getAllUsers = (req, res) => {
  User.find()
    .select("-password")
    .then((users) => res.status(200).json(users))
    .catch((error) => res.status(500).json({ error }));
};

//////////////////////////////////////////////////////update user's data
exports.updateUser = (req, res) => {
  User.findOne({ _id: req.params.id })
    .then((user) => {
      // vérifications des autorisations
      if (req.params.id === req.token.userId) {
        User.updateOne(
          { _id: req.params.id },
          {
            // modification des informations de l'utilisateur
            firstName: req.body.firstName,
            function: req.body.function,
            bio: req.body.bio,
          }
        )
          .then(() => res.status(200).json({ message: "Profil modifié!" }))
          .catch((error) => res.status(400).json({ error }));
      } else {
        res.status(401).json({ error: "Non autorisé" });
      }
    })
    .catch((error) => res.status(500).json({ error }));
};

///////////////////////////////////////////////update user's picture
exports.uploadImg = (req, res) => {
  User.findOne({ _id: req.params.id })
    .then((user) => {
      // suppresion de l'ancienne image
      const filename = user.imageUrl.split("/images/users/")[1];
      if (req.file && filename !== "defaultpicture.svg") {
        fs.unlink(`images/users/${filename}`, (err) => {
          if (err) {
            throw err;
          }
        });
      }

      // mise à jour de la nouvelle photo
      if (req.params.id === req.token.userId) {
        User.updateOne(
          { _id: req.params.id },
          {
            imageUrl: `${req.protocol}://${req.get("host")}/images/users/${
              req.file.filename
            }`,
            _id: req.params.id,
          }
        )
          .then(() => res.status(200).json({ message: "Photo modifiée!" }))
          .catch((error) => res.status(400).json({ error }));
      } else {
        res.status(401).json({ error: "Non autorisé" });
      }
    })
    .catch((error) => res.status(500).json({ error }));
};

///////////////////////////////////////////////delete user's picture
exports.deleteImg = (req, res) => {
  User.findOne({ _id: req.params.id })
    .then((user) => {
      // suppresion de l'ancienne image
      const filename = user.imageUrl.split("/images/users/")[1];
      if (filename !== "defaultpicture.svg") {
        fs.unlink(`images/users/${filename}`, (err) => {
          if (err) {
            throw err;
          }
        });
      }

      // mise à jour du profil avec la photo par défaut
      if (req.params.id === req.token.userId) {
        User.updateOne(
          { _id: req.params.id },
          {
            imageUrl: `${req.protocol}://${req.get(
              "host"
            )}/images/users/defaultpicture.svg`,
            _id: req.params.id,
          }
        )
          .then(() => res.status(200).json({ message: "Photo supprimée!" }))
          .catch((error) => res.status(400).json({ error }));
      } else {
        res.status(401).json({ error: "Non autorisé" });
      }
    })
    .catch((error) => res.status(500).json({ error }));
};

///////////////////////////////////////////////delete user's profile
exports.deleteUser = (req, res) => {
  User.findOne({ _id: req.params.id })
    .then((user) => {
      // suppresion de l'image
      const filename = user.imageUrl.split("/images/users/")[1];
      if (filename !== "defaultpicture.svg") {
        fs.unlink(`images/users/${filename}`, (err) => {
          if (err) {
            throw err;
          }
        });
      }
    })
    .catch((err) => res.status(500).json({ err }));

  // vérification des autorisations
  if (req.params.id === req.token.userId || req.token.userRole === "admin") {
    // suppression du compte dans la BD et suppression du cookie
    User.deleteOne({ _id: req.params.id })
      .then(() => {
        res.clearCookie("jwt");
        res.redirect("/");
      })
      .catch((error) => res.status(400).json({ error }));
  } else {
    res.status(401).json({ error: "Non autorisé" });
  }
};
