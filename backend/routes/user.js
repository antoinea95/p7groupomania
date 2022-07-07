// import express and Router
const express= require('express');
const router = express.Router();

// import user's controllers
const userCtrl = require('../controllers/user');

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);




module.exports = router;