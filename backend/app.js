require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/user");
const bookRoutes = require("./routes/book");
const path = require("path");
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./config/swagger_output.json')

const app = express();
mongoose
  .connect(
    process.env.DB_LINK,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
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

app.get("/ping", function (req, res) {
  res.send("pong");
});
app.use(express.json());
app.use("/api/auth", userRoutes);
app.use("/api/books", bookRoutes);
app.use("/images", express.static(path.join(__dirname, "images")));
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))

module.exports = app;
