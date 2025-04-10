import { Request, Response } from "express";
import User from "../models/User";
import {
  ClearFavoritesResponse,
  FavoriteComicResponse,
  FavoriteResponse,
  FavoritesResponse,
  ToggleCharacterBody,
  ToggleComicBody,
} from "../types/favorites";

export const toggleCharacterFavorite = async (
  req: Request<{}, {}, ToggleCharacterBody>,
  res: Response<FavoriteResponse | { message: string }>
) => {
  try {
    const { character } = req.body;
    const userId = req.user?._id;

    if (!character || !userId) {
      res.status(400).json({ message: "Invalid request" });
      return;
    }

    // Get user
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Check if character exists
    const existingIndex = user.favorites.characters.findIndex((c) => c._id === character._id);

    // Toggle state
    if (existingIndex > -1) {
      // Remove if exists
      user.favorites.characters.splice(existingIndex, 1);
    } else {
      // Add if not exists
      user.favorites.characters.push(character);
    }

    // Save with validation
    const savedUser = await user.save();

    // Secure response without sensitive data
    res.json({
      characters: savedUser.favorites.characters,
    });
    return;
  } catch (error) {
    console.error("Error updating favorites:", error);
    res.status(500).json({ message: "Server error" });
    return;
  }
};

export const toggleComicFavorite = async (
  req: Request<{}, {}, ToggleComicBody>,
  res: Response<FavoriteComicResponse | { message: string }>
) => {
  try {
    const { comic } = req.body;
    const userId = req.user?._id;

    // Validate request body
    if (!comic || !userId) {
      res.status(400).json({ message: "Invalid request body" });
      return;
    }

    // Retrieve user with type safety
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Check if comic already exists in favorites
    const existingIndex = user.favorites.comics.findIndex((c) => c._id === comic._id);

    // Toggle comic state
    if (existingIndex > -1) {
      // Remove comic if already exists
      user.favorites.comics.splice(existingIndex, 1);
    } else {
      // Add comic if not present
      user.favorites.comics.push(comic);
    }

    // Save changes with Mongoose validation
    const savedUser = await user.save();

    // Return updated list without sensitive data
    res.json({
      comics: savedUser.favorites.comics,
    });
    return;
  } catch (error) {
    console.error("Error updating comic favorites:", error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

export const getCombinedFavorites = async (req: Request, res: Response<FavoritesResponse | { message: string }>) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      res.status(400).json({ message: "Invalid user identification" });
      return;
    }

    // Fetch with explicit type casting
    const user = await User.findById(userId).select("favorites").exec();

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Manual conversion to response type
    const responseData: FavoritesResponse = {
      favorites: {
        characters: user.favorites.characters.map((c) => ({
          _id: c._id.toString(),
          name: c.name,
          description: c.description,
          thumbnail: c.thumbnail,
          comics: c.comics,
        })),
        comics: user.favorites.comics.map((c) => ({
          _id: c._id.toString(),
          title: c.title,
          description: c.description,
          thumbnail: c.thumbnail,
        })),
      },
    };

    res.json(responseData);
    return;
  } catch (error) {
    console.error("Error fetching favorites:", error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

export const clearAllFavorites = async (req: Request, res: Response<ClearFavoritesResponse | { message: string }>) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      res.status(400).json({ message: "Invalid user identification" });
      return;
    }

    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Clear both favorites arrays
    user.favorites.characters = [];
    user.favorites.comics = [];

    // Save changes
    const savedUser = await user.save();

    res.json({
      message: "All favorites cleared successfully",
      favorites: {
        characters: savedUser.favorites.characters,
        comics: savedUser.favorites.comics,
      },
    });
    return;
  } catch (error) {
    console.error("Error clearing favorites:", error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};
