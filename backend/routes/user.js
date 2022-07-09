// import express and Router
const express= require('express');
const router = express.Router();

// import middlewares
const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer-users');

// import user's controllers
const authUserCtrl = require('../controllers/auth-user');
const userCtrl = require('../controllers/user');

// user's signup & login
router.post('/signup', authUserCtrl.signup);
router.post('/login', authUserCtrl.login);

// update user's profile
router.put('/user/:id', auth, multer, userCtrl.updateUser);
router.put('/user/:id/upload', auth, multer, userCtrl.uploadImg);

// get user
router.get('/user', auth, userCtrl.getAllUsers);
router.get('/user/:id', auth, userCtrl.getUser);





module.exports = router;