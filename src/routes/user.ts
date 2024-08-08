import express, { Request, Response, Router } from "express";
import isAuthenticated from "../middlewares/isAuthenticated";
import User from "../models/User";
import { TCharacters, TComic as TComics } from "../models/types";
import { generateHash, generateUID } from "../utils";

const userRoutes = Router();

// Interface pour les champs de formulaire
interface FormFields {
  fields: {
    email?: string;
    username?: string;
    password?: string;
  };
}

// Inscription
userRoutes.post("/user/signup", async (req: Request, res: Response) => {
  try {
    const { email, username, password } = (req as FormFields)?.fields;

    const user = await User.findOne({ email });
    if (user) {
      res.status(409).json({ error: { message: "User already exists" } });
    } else if (email && username && password) {
      const salt = generateUID();
      const hash = generateHash(password, salt);
      const token = generateUID();
      const favorites: {
        characters: TCharacters[];
        comics: TComics[];
      } = {
        characters: [],
        comics: [],
      };

      const newUser = new User({
        email,
        username,
        favorites,
        token,
        hash,
        salt,
      });

      await newUser.save();
      const newUserReturned = await User.findOne({ token: token }).select("_id username email favorites token");

      res.status(200).json({
        _id: newUserReturned?._id,
        username: newUserReturned?.username,
        email: newUserReturned?.email,
        favorites: newUserReturned?.favorites,
        token: newUserReturned?.token,
      });
    } else {
      res.status(400).json({ error: { message: "Some element(s) missing" } });
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

// Connexion
userRoutes.post("/user/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = (req as FormFields)?.fields;

    if (email && password) {
      const user = await User.findOne({ email });

      if (user) {
        const userHash = user.hash;
        const userSalt = user.salt;
        const hashToCompare = generateHash(password, userSalt);
        if (userHash === hashToCompare) {
          console.log("authentification succeed");
          res.status(200).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            token: user.token,
          });
        } else {
          console.log("unauthorized");
          res.status(401).json({ error: { message: "Wrong email or password" } });
        }
      } else {
        console.log("This email doesn't have an account");
        res.status(404).json({ error: { message: "This email doesn't have an account" } });
      }
    } else {
      res.status(400).json({ error: { message: "Missing parameters" } });
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

// Récupérer les informations utilisateur par token
userRoutes.get("/user/:token", isAuthenticated, async (req: Request, res: Response) => {
  try {
    if (req.params.token) {
      const token = req.params.token;
      const user = await User.findOne({ token }).select("email _id username favorites");
      if (user) {
        console.log("authorized token");
        res.status(200).json({ user });
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } else {
      res.status(400).json({ message: "Token is missing" });
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

export default userRoutes;
