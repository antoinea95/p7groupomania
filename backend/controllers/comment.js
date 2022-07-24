const Post = require("../models/post");

//////////////////////////////////////////create comment
exports.createComment = (req, res) => {
  // Recherche du post à l'aide son id
  Post.findOne({ _id: req.params.id })
    .then((post) => {
      //Le post est mis à jour avec le nouveau commentaire
      Post.updateOne(
        { _id: req.params.id },
        {
          $push: {
            // push permet d'ajouter un nouvel élément au tableau de commentaire
            comments: {
              commenterId: req.body.userId, // id de l'utilisateur qui commente
              text: req.body.text, // contenu du commentaire
            },
          },
        }
      )
        .then(() => res.status(200).json({ message: "commentaire posté !" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

//////////////////////////////////////////update comment
exports.updateComment = (req, res) => {
  Post.findOne({ _id: req.params.id })
    .then((post) => {
      // La méthode find permet de retrouver le commentaire modifié
      const updateComment = post.comments.find((comment) =>
        comment._id.equals(req.body.commentId)
      );
      updateComment.text = req.body.text;

      // la méthode filter permet de supprimer l'ancien commentaire
      const newComments = post.comments.filter(
        (comments) => comments._id !== updateComment._id
      );
      // push du commentaire modifié dans le tableau des commentaires
      newComments.push(updateComment);

      // Vérification des autorisations de l'utilisateurs et mise à jour du post
      if (
        updateComment.commenterId === req.token.userId ||
        req.token.userRole === "admin"
      ) {
        Post.updateOne({ _id: req.params.id }, { comments: newComments })
          .then(() =>
            res.status(200).json({ message: "commentaires modifié!" })
          )
          .catch((error) => res.status(400).json({ error }));
      } else {
        return res.status(403).json({ message: "Non autorisé" });
      }
    })
    .catch((error) => res.status(500).json({ error }));
};

//////////////////////////////////////////delete comment
exports.deleteComment = (req, res) => {
  Post.findOne({ _id: req.params.id })
    .then((post) => {
      // La méthode find permet de retrouver le commentaire à supprimer
      const deleteComment = post.comments.find((comment) =>
        comment._id.equals(req.body.commentId)
      );

      // La méthode filter permet de retirer le commentaire supprimer
      const newComments = post.comments.filter(
        (comments) => comments._id !== deleteComment._id
      );

      // Vérifications des autortisations
      if (
        deleteComment.commenterId === req.token.userId ||
        req.token.userRole === "admin"
      ) {
        Post.updateOne({ _id: req.params.id }, { comments: newComments })
          .then(() =>
            res.status(200).json({ message: "commentaires supprimé!" })
          )
          .catch((error) => res.status(400).json({ error }));
      } else {
        return res.status(403).json({ message: "Non autorisé" });
      }
    })
    .catch((error) => res.status(500).json({ error }));
};
