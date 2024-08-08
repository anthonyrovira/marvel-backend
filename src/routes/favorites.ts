import { Response, Router } from "express";
import isAuthenticated from "../middlewares/isAuthenticated";
import User from "../models/User";
import { IUser, TCharacters as TCharacter, TComic } from "../models/types"; // Assurez-vous que ces types sont définis

const favoritesRoutes = Router();

interface FavoritesRequest {
  user?: IUser;
  fields: {
    _id?: string;
    title?: string;
    description?: string;
    thumbnail?: {
      path: string;
      extension: string;
    };
    name?: string;
    comics?: any[];
  };
}

// Route pour gérer les favoris de comics
favoritesRoutes.post("/favorites/comics", isAuthenticated, async (req, res: Response) => {
  try {
    const { _id, title, description, thumbnail } = (req as FavoritesRequest)?.fields || {};
    const user = (req as FavoritesRequest)?.user;

    if (!user || !_id) {
      return res.status(401).json({ message: "fields are missing" });
    }

    // Fonction pour vérifier si un comic est déjà dans les favoris
    const findComicIndex = (comics: TComic[], id: string) => comics.findIndex((comic) => comic._id === id);

    // Déterminer si le comic est déjà dans les favoris
    const index = findComicIndex(user.favorites.comics, _id);
    const isFavorite = index === -1;

    if (isFavorite) {
      // Ajouter le comic aux favoris s'il n'est pas déjà présent
      const newComic: TComic = {
        _id,
        title: title || "",
        description: description || "",
        thumbnail: thumbnail || { path: "", extension: "" },
      };
      user.favorites.comics.push(newComic);
    } else {
      // Retirer le comic des favoris s'il est déjà présent
      user.favorites.comics.splice(index, 1);
    }

    user.markModified("favorites.comics");
    await user.save();

    res.status(200).json({ isFavorite });
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      return res.status(400).json({ message: error.message });
    } else {
      // Si l'erreur n'est pas une instance de `Error`
      console.log("Unknown error occurred");
      return res.status(400).json({ message: "An unknown error occurred" });
    }
  }
});

// Route pour gérer les favoris de personnages
favoritesRoutes.post("/favorites/characters", isAuthenticated, async (req, res: Response) => {
  try {
    const { _id, name, description, thumbnail, comics } = (req as FavoritesRequest)?.fields || {};
    const user = (req as FavoritesRequest)?.user;

    if (!user || !_id) {
      return res.status(401).json({ message: "User or fields are missing" });
    }

    // Fonction pour vérifier si un personnage est déjà dans les favoris
    const findCharacterIndex = (characters: TCharacter[], id: string) =>
      characters.findIndex((character) => character._id === id);

    // Déterminer si le personnage est déjà dans les favoris
    const index = findCharacterIndex(user.favorites.characters, _id);
    const isFavorite = index === -1;

    if (isFavorite) {
      // Ajouter le personnage aux favoris s'il n'est pas déjà présent
      const newCharacter: TCharacter = {
        _id,
        name: name || "",
        description: description || "",
        thumbnail: thumbnail || { path: "", extension: "" },
        comics: comics || [],
      };
      user.favorites.characters.push(newCharacter);
    } else {
      // Retirer le personnage des favoris s'il est déjà présent
      user.favorites.characters.splice(index, 1);
    }

    user.markModified("favorites.characters");
    await user.save();

    res.status(200).json({ isFavorite });
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      return res.status(400).json({ message: error.message });
    } else {
      // Si l'erreur n'est pas une instance de `Error`
      console.log("Unknown error occurred");
      return res.status(400).json({ message: "An unknown error occurred" });
    }
  }
});

// Route pour obtenir les favoris
favoritesRoutes.get("/favorites", isAuthenticated, async (req, res: Response) => {
  try {
    const user = (req as FavoritesRequest)?.user;

    if (user) {
      const { comics, characters } = user.favorites;
      res.status(200).json({ comics, characters });
    } else {
      res.status(401).json({ message: "User not authenticated" });
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      return res.status(400).json({ message: error.message });
    } else {
      // Si l'erreur n'est pas une instance de `Error`
      console.log("Unknown error occurred");
      return res.status(400).json({ message: "An unknown error occurred" });
    }
  }
});

// Route pour vider les favoris
favoritesRoutes.delete("/favorites", isAuthenticated, async (req, res: Response) => {
  try {
    const emptyFavorites = { characters: [], comics: [] };
    const user = (req as FavoritesRequest)?.user;

    if (user) {
      user.favorites = emptyFavorites;
      user.markModified("favorites");

      await user.save();

      const userReturned = await User.findOne({ email: user.email }).select("favorites");

      if (userReturned && userReturned.favorites.characters.length === 0 && userReturned.favorites.comics.length === 0) {
        res.status(200).json({ message: "Database is now empty" });
      } else {
        res.status(400).json({ message: "Bad request, something went wrong with database" });
      }
    } else {
      res.status(401).json({ message: "User not authenticated" });
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      return res.status(400).json({ message: error.message });
    } else {
      // Si l'erreur n'est pas une instance de `Error`
      console.log("Unknown error occurred");
      return res.status(400).json({ message: "An unknown error occurred" });
    }
  }
});

export default favoritesRoutes;
