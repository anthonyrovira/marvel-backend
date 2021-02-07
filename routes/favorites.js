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
      const { _id, title } = req.fields;
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
          title,
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

router.post("/favorites/characters", isAuthenticated, async (req, res) => {
  try {
    if (req.fields) {
      let _id;
      let name;
      if (req.fields.name) {
        _id = req.fields._id;
        name = req.fields.name;
      } else {
        _id = req.fields._id;
      }

      //console.log(newComic);
      let user = req.user;
      let index = 0;
      let isFavorite = false;

      const favoritesCharacters = [...user.favorites.characters];
      let isCharacterAlreadyFavorite = false;

      for (let i = 0; i < favoritesCharacters.length; i++) {
        // Si le newCharacter est déjà présent dans les favoris
        if (_id === user.favorites.characters[i]._id) {
          isCharacterAlreadyFavorite = true;
          index = i;
          break;
        }
      }
      // Il est déjà présent dans les favoris
      if (isCharacterAlreadyFavorite) {
        favoritesCharacters.splice(index, 1);
        isFavorite = false;
      }
      // S'il ne l'est pas, on doit l'y ajouter
      else {
        let newComic = {};
        if (req.fields.name) {
          newComic = {
            _id,
            name,
          };
        } else {
          newComic = {
            _id,
          };
        }

        favoritesCharacters.push(newComic);
        isFavorite = true;
      }

      user.favorites.characters = favoritesCharacters;

      user.markModified("favorites.characters");
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

router.get("/favorites", isAuthenticated, async (req, res) => {
  try {
    let user = req.user;

    comics = user.favorites.comics;
    characters = user.favorites.characters;
    res.status(200).json({ comics, characters });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

router.delete("/favorites", isAuthenticated, async (req, res) => {
  try {
    const emptyFavorites = {
      characters: [],
      comics: [],
    };

    let user = req.user;
    user.favorites = emptyFavorites;
    user.markModified("favorites");

    await user.save();

    const userReturned = await User.findOne({ email: user.email }).select(
      "favorites"
    );

    if (userReturned.favorites.length === 0) {
      res.status(200).json({
        message: "database is now empty",
      });
    } else {
      res.status(400).json({
        message: "bad request, something went wrong with database",
      });
    }
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
