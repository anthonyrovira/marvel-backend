import express from "express";
import { authenticate } from "../middlewares/authMiddleware";
import {
  clearAllFavorites,
  getCombinedFavorites,
  toggleCharacterFavorite,
  toggleComicFavorite,
} from "../controllers/favoritesController";

const favoritesRoutes = express.Router();

favoritesRoutes.post("/favorites/characters", authenticate, toggleCharacterFavorite);
favoritesRoutes.post("/favorites/comics", authenticate, toggleComicFavorite);
favoritesRoutes.get("/favorites", authenticate, getCombinedFavorites);
favoritesRoutes.delete("/favorites", authenticate, clearAllFavorites);

export default favoritesRoutes;
