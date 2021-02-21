const express = require("express");
const formidable = require("express-formidable");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();

const app = express();
app.use(formidable());
app.use(cors());

mongoose.connect(process.env.MONGODB_URI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
});

/* ROUTES */
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

const userRoutes = require("./routes/user");
app.use(userRoutes);
const favoritesRoutes = require("./routes/favorites");
app.use(favoritesRoutes);

app.all("*", (req, res) => {
  console.log("Route is not defined");
  res.status(400).json({ message: "Page not found" });
});

/* SERVER */
app.listen(process.env.PORT, () => {
  console.log(`Server has started on port ${process.env.PORT}`);
});
