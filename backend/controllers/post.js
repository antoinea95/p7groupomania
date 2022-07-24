const Post = require("../models/post");
const fs = require("fs");

/////////////////////////////////////////////create post
exports.createPost = (req, res) => {
  //création d'un nouveau post avec ou sans image
  const post = new Post(
    // avec image
    req.file
      ? {
          ...req.body,
          imageUrl: `${req.protocol}://${req.get("host")}/images/posts/${
            req.file.filename
          }`,
        }
      : // sans image
        {
          userId: req.body.userId,
          message: req.body.message,
          comments: [],
          likes: 0,
          usersLiked: [],
        }
  );

  // vérifications des autorisations et sauvegarde du post dans la BD
  if (post.userId === req.token.userId) {
    post
      .save()
      .then(() => res.status(201).json({ message: "Post Créé!" }))
      .catch((error) => res.status(400).json({ error }));
  } else {
    res.status(401).json({ error: post.userId });
  }
};

/////////////////////////////////////////////get all post
exports.getAllPosts = (req, res) => {
  Post.find()
    .then((posts) => res.status(200).json(posts))
    .catch((error) => res.status(400).json({ error }));
};

/////////////////////////////////////////////get post
exports.getOnePost = (req, res) => {
  Post.findOne({ _id: req.params.id })
    .then((post) => res.status(200).json(post))
    .catch((error) => res.status(400).json({ error }));
};

/////////////////////////////////////////////update post
exports.updatePost = (req, res) => {
  // si le post contient une image et que la req aussi, suppression l'ancienne image
  Post.findOne({ _id: req.params.id })
    .then((post) => {
      if (req.file && post.imageUrl !== undefined) {
        const filename = post.imageUrl.split("/images/posts/")[1];
        fs.unlink(`images/posts/${filename}`, (err) => {
          if (err) {
            throw err;
          }
        });
      }
    })
    .catch((error) => res.status(500).json({ error }));

  Post.findOne({ _id: req.params.id })
    .then((post) => {
      //Si le post contient un ficher
      const postObject = req.file
        ? {
            ...req.body,
            imageUrl: `${req.protocol}://${req.get("host")}/images/posts/${
              req.file.filename
            }`,
          }
        : { ...req.body };

      // Vérifications des autorisations et mise à jour du post
      if (post.userId === req.token.userId || req.token.userRole === "admin") {
        Post.updateOne(
          { _id: req.params.id },
          { ...postObject, _id: req.params.id }
        )
          .then(() => res.status(200).json({ message: req.body }))
          .catch((error) => res.status(400).json({ error }));
      } else {
        res.status(401).json({ error: "Non autorisé" });
      }
    })
    .catch((error) => res.status(500).json(req.body));
};

/////////////////////////////////////////////delete post
exports.deletePost = (req, res) => {
  Post.findOne({ _id: req.params.id })
    .then((post) => {
      // vérifications des autorisations
      if (post.userId === req.token.userId || req.token.userRole === "admin") {
        // si le post contient une image, suppression de l'image
        if (post.imageUrl) {
          const filename = post.imageUrl.split("/images/posts")[1];
          fs.unlink(`images/posts/${filename}`, (err) => {
            if (err) throw err;
          });
        }
        // suppression du post dans la BD
        Post.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "Post supprimé" }))
          .catch((error) => res.status(400).json({ error }));
      } else {
        res.status(401).json({ error: filename });
      }
    })
    .catch((error) => res.status(500).json({ error }));
};

/////////////////////////////////////////////like post
exports.likePost = (req, res) => {
  Post.findOne({ _id: req.params.id })
    .then((post) => {
      //récupération des données de la requête
      const userId = req.body.userId;
      const like = req.body.like;

      // si l'userId est dans le tableau, la valeur sera true
      const likeId = post.usersLiked.includes(userId);

      switch (true) {
        // si le like n'est pas égal à 1 ou 0 alors renvoie d'une erreur
        case like !== 0 && like !== 1:
          res.status(403).json({ message: "Non autorisé" });
          break;

        // si l'utilisateur à déja liker alors renvoie d'une erreur
        case like === 1 && likeId:
          res.status(403).json({ message: "Non autorisé" });
          break;

        // si l'utilisateur like et qu'il n'a pas déjà liké, on augmente le nombre de like et on ajoute l'userId au tableau des likes
        case like === 1 && likeId === false:
          Post.updateOne(
            { _id: req.params.id },
            { $inc: { likes: +1 }, $push: { usersLiked: userId } }
          )
            .then(() => res.status(200).json({ message: "like envoyé" }))
            .catch((error) => res.status(400).json({ error }));
          break;

        // si l'utilisateur annule son like, on diminue le nombre de like et on retire l'userId au tableau des likes
        case like === 0 && likeId:
          Post.updateOne(
            { _id: req.params.id },
            { $inc: { likes: -1 }, $pull: { usersLiked: userId } }
          )
            .then(() => res.status(200).json({ message: "like annulé" }))
            .catch((error) => res.status(400).json({ error }));
          break;
      }
    })
    .catch((error) => res.status(400).json({ error }));
};
