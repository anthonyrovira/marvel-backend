const express = require("express");
const uid2 = require("uid2");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const isAuthenticated = require("../middlewares/isAuthenticated");

const router = express.Router();

// Imports des modèles
const User = require("../models/User");

router.post("/favorites/comics", isAuthenticated, async (req, res) => {
  try {
    if (req.fields) {
      const { newComic } = req.fields;
      const allComics = await User.find({ favorites: { comics } });
      console.log(allComics);
      res.status(200).json({
        allComics,
      });
      /*
      if (email && username && password) {
        // Générer un salt
        const salt = uid2(64);
        // Générer un hash (résultat de l'encryptage du password+salt)
        const hash = SHA256(password + salt).toString(encBase64);
        // Générer un token (chaîne de caractère aléatoire)
        const token = uid2(64);
        // Initialisation des favoris
        const favorites = {
          characters: [],
          comics: [],
        };

        const newUser = new User({
          email: email,
          username: username,
          favorites: favorites,
          token: token,
          hash: hash,
          salt: salt,
        });

        await newUser.save();
        const newUserReturned = await User.findOne({ token: token }).select(
          "_id username email favorites token"
        );

        res.status(200).json({
          _id: newUserReturned._id,
          username: newUserReturned.username,
          email: newUserReturned.email,
          favorites: newUserReturned.favorites,
          token: newUserReturned.token,
        });
      } else {
        res.status(400).json({ message: "Fields are missing" });
      }*/
    } else {
      res.status(401).json({ message: "Fields are missing" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});
/*
router.post("/favorites/character", isAuthenticated, async (req, res) => {
  try {
    const { email, password } = req.fields;
    if (email && password) {
      const user = await User.findOne({ email: email });

      if (user) {
        const userHash = user.hash;
        const userSalt = user.salt;
        const hashToCompare = SHA256(password + userSalt).toString(encBase64);
        if (userHash === hashToCompare) {
          console.log("authentification succeed");
          res.status(200).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            favorites: user.favorites,
            token: user.token,
          });
        } else {
          console.log("unauthorized");
          res.status(400).json({ message: "unauthorized" });
        }
      } else {
        res.status(400).json({ message: "user not found" });
      }
    } else {
      res.status(400).json({ error: "Missing parameters" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

router.get("/favorites", isAuthenticated, async (req, res) => {
  try {
    if (req.params.token) {
      const token = req.params.token;
      const user = await User.findOne({ token: token }).select(
        "email _id username favorites token"
      );
      if (user) {
        console.log("authorized token");
        res.status(200).json({ user });
      }
    } else {
      res.status(400).json({ message: "token is missing" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

router.delete("/favorites", isAuthenticated, async (req, res) => {
  try {
    if (req.params.token) {
      const token = req.params.token;
      const user = await User.findOne({ token: token }).select(
        "email _id username favorites token"
      );
      if (user) {
        console.log("authorized token");
        res.status(200).json({ user });
      }
    } else {
      res.status(400).json({ message: "token is missing" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});
*/
module.exports = router;
