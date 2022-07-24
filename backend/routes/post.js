// import express and Router
const express = require("express");
const router = express.Router();

// import des middlewares
const auth = require("../middlewares/auth");
const multer = require("../middlewares/multer-posts");

// import des controllers
const postCtrl = require("../controllers/post");
const commentCtrl = require("../controllers/comment");

// routes des posts
router.get("/", auth, postCtrl.getAllPosts);
router.get("/:id", auth, postCtrl.getOnePost);
router.post("/", auth, multer, postCtrl.createPost);
router.post("/:id/like", auth, postCtrl.likePost);
router.put("/:id", auth, multer, postCtrl.updatePost);
router.delete("/:id", auth, postCtrl.deletePost);

// routes des commentaires
router.post("/:id/comment", auth, commentCtrl.createComment);
router.put("/:id/comment", auth, commentCtrl.updateComment);
router.delete("/:id/comment", auth, commentCtrl.deleteComment);

module.exports = router;
