// import express and Router
const express= require('express');
const router = express.Router();

// import middleware
const auth = require('../middlewares/auth')
const multer = require('../middlewares/multer-posts');

// import post's controller
const postCtrl = require('../controllers/post');

// import comment's controller
const commentCtrl = require('../controllers/comment')

// post's routes
router.get('/', auth, postCtrl.getAllPosts);
router.get('/:id', auth, postCtrl.getOnePost);
router.post('/', auth, multer, postCtrl.createPost);
router.post('/:id/like', auth, postCtrl.likePost);
router.put('/:id', auth, multer, postCtrl.updatePost);
router.delete('/:id', auth, postCtrl.deletePost);

// comment's routes
router.post('/:id/comment', auth, commentCtrl.createComment);
router.put('/:id/comment', auth, commentCtrl.updateComment);
router.delete('/:id/comment', auth, commentCtrl.deleteComment);


module.exports = router;