//import de multer
const multer = require('multer');

// mise en place d'un dictionnaire pour récupérer les extensions image
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpeg',
    'image/png': 'png',
}

// création de la destination et du nom du fichier récupéré
const storage = multer.diskStorage ({
    destination: (req, file, callback) => {
        callback(null, 'images/users')
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);
    }
});

// export
module.exports = multer({storage}).single('file');