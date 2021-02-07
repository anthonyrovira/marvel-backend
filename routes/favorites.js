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
      const { _id } = req.fields;
      //console.log(newComic);
      let user = req.user;
      let index = 0;
      let isFavorite = false;

      const favoritesComics = [...user.favorites.comics];
      let isComicAlreadyFavorite = false;

      for (let i = 0; i < favoritesComics.length; i++) {
        // Si le newComic est déjà présent dans les favoris
        if (_id === user.favorites.comics[i]._id) {
          isComicAlreadyFavorite = true;
          index = i;
          break;
        }
      }
      // Il est déjà présent dans les favoris
      if (isComicAlreadyFavorite) {
        favoritesComics.splice(index, 1);
        isFavorite = false;
      }
      // S'il ne l'est pas, on doit l'y ajouter
      else {
        const newComic = {
          _id,
        };
        favoritesComics.push(newComic);
        isFavorite = true;
      }

      user.favorites.comics = favoritesComics;

      user.markModified("favorites.comics");
      //console.log(user);
      // On enregistre dans la BDD
      await user.save();

      res.status(200).json({ isFavorite });
      /*

      res.status(200).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        favorites: user.favorites,
      });
      */
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
