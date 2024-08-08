import { Request, Response, NextFunction } from "express";
import User from "../models/User";
import { IUser } from "../models/types";

// Définition du type Request avec l'ajout de la propriété user
interface AuthenticatedRequest extends Request {
  user?: IUser;
}

const isAuthenticated = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (req.headers.authorization) {
      // On récupère le token utilisateur
      const token = req.headers.authorization.replace("Bearer ", "");

      // On vérifie la présence de ce token dans la base de données
      const user = await User.findOne({ token }).select("email username _id favorites");

      if (user) {
        // On ajoute une clé user à l'objet req
        req.user = user;
        return next();
      } else {
        return res.status(400).json({ message: "Unauthorized" });
      }
    } else {
      return res.status(400).json({ message: "Authorization is missing" });
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
};

export default isAuthenticated;
