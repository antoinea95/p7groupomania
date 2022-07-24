//import de multer
const multer = require("multer");

// shortId permet de générer un nom unique, utilisation pour le nom des images
const shortId = require("shortid");

// mise en place d'un dictionnaire pour récupérer les extensions image
const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpeg",
  "image/png": "png",
};

// création de la destination et du nom du fichier récupéré
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images/posts");
  },
  filename: (req, file, callback) => {
    const name = shortId.generate();
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + "." + extension);
  },
});

// export
module.exports = multer({ storage }).single("file");
