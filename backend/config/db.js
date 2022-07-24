const mongoose = require('mongoose');

// connexion à la base de donnée mongoDB
mongoose
    .connect(`mongodb+srv://${process.env.MONGODB_URL}`,
    { useNewUrlParser: true,
    useUnifiedTopology: true })
      .then(() => console.log('Connexion à MongoDB réussie !'))
      .catch(() => console.log('Connexion à MongoDB échouée !'));