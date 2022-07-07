const express = require('express');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize')
require('./config/db');

const userRoute = require('./routes/user');

const app = express();

app.use(helmet());

/* Headers permettent d'accéder à l'API depuis n'importe quelle orgine, d'ajouter les headers mentionnées 
et de formuler les requêtes avec les méthodes mentionnées */
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(mongoSanitize());
app.use(express.json());


app.use('/api/auth', userRoute);


module.exports = app;