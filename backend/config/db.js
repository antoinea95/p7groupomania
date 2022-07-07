const mongoose = require('mongoose');


mongoose
    .connect(`mongodb+srv://${process.env.MONGODB_URL}`,
    { useNewUrlParser: true,
    useUnifiedTopology: true })
      .then(() => console.log('Connexion à MongoDB réussie !'))
      .catch(() => console.log('Connexion à MongoDB échouée !'));