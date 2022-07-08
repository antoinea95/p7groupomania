// import express and Router
const express= require('express');
const router = express.Router();

// import middleware
const auth = require('../middlewares/auth')
const multer = require('../middlewares/multer');

// import post's controllers
const postCtrl = require('../controllers/post');

// post's route
router.get('/', auth, postCtrl.getAllPosts);
// router.get('/:id', auth, postCtrl.getOnePost);
router.post('/', auth, multer, postCtrl.createPost);
// router.post('/:id/like', auth, postCtrl.likePost);
router.put('/:id', auth, postCtrl.updatePost);
router.delete('/:id', auth, postCtrl.deletePost);


module.exports = router;