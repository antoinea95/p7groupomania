// import express and Router
const express= require('express');
const router = express.Router();

// import middlewares
const auth = require('../middlewares/auth');
const password = require('../middlewares/password')
const multer = require('../middlewares/multer-users');

// import user's controllers
const authUserCtrl = require('../controllers/auth-user');
const userCtrl = require('../controllers/user');

// user's signup & login
router.post('/signup', password, multer, authUserCtrl.signup);
router.post('/login', authUserCtrl.login);
router.get('/logout', auth, authUserCtrl.logout);

// update user's profile
router.put('/user/:id', auth, userCtrl.updateUser);
router.put('/user/:id/upload', auth, multer, userCtrl.uploadImg);

// get user
router.get('/user', auth, userCtrl.getAllUsers);
router.get('/user/:id', auth, userCtrl.getUser);
router.get('/jwt', auth, authUserCtrl.getToken);






module.exports = router;