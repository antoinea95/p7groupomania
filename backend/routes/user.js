const express = require("express");
const router = express.Router();

// import des middlewares
const auth = require("../middlewares/auth");
const password = require("../middlewares/password");
const multer = require("../middlewares/multer-users");

// import des controllers
const authUserCtrl = require("../controllers/auth-user");
const userCtrl = require("../controllers/user");

// connexion de l'utilisation
router.post("/signup", password, multer, authUserCtrl.signup);
router.post("/login", authUserCtrl.login);
router.get("/:id/logout", auth, authUserCtrl.logout);

// Modification du profil de l'utilisateur
router.put("/user/:id", auth, userCtrl.updateUser);
router.put("/user/:id/upload", auth, multer, userCtrl.uploadImg);
router.put("/user/:id/delete", auth, multer, userCtrl.deleteImg);
router.delete("/user/:id", auth, userCtrl.deleteUser);

// Routes get
router.get("/user", auth, userCtrl.getAllUsers);
router.get("/user/:id", auth, userCtrl.getUser);
router.get("/jwt", auth, authUserCtrl.getToken);

module.exports = router;
