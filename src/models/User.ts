import mongoose, { Schema } from "mongoose";
import { IUser } from "./types";

// Schéma Mongoose pour le modèle User
const UserSchema: Schema<IUser> = new Schema({
  email: { type: String, unique: true, required: true },
  username: { type: String, unique: true, required: true },
  favorites: {
    characters: { type: [Object], required: true }, // Pour les tableaux, il est recommandé d'utiliser Object et de gérer la validation avec TypeScript
    comics: { type: [Object], required: true },
  },
  token: { type: String },
  hash: { type: String },
  salt: { type: String },
});

// Créer et exporter le modèle
const User = mongoose.model<IUser>("User", UserSchema);
export default User;
