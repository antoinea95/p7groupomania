const express = require("express");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// import de la connexion a mongoDB
require("./config/db");

const userRoute = require("./routes/user");
const postRoute = require("./routes/post");

const app = express();

app.use(cookieParser());
app.use(helmet());

/* Headers permettent d'accéder à l'API depuis n'importe quelle orgine, d'ajouter les headers mentionnées 
et de formuler les requêtes avec les méthodes mentionnées */
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cross-Origin-Resource-Policy", "same-site");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

// configuration pour les requêtes axios
const corsConfig = {
  origin: true,
  credentials: true,
};

app.use(cors(corsConfig));
app.options("*", cors(corsConfig));

app.use(mongoSanitize());
app.use(express.json());

app.use("/api/auth", userRoute);
app.use("/api/posts/", postRoute);

app.use("/images", express.static(path.join(__dirname, "images")));

module.exports = app;
