import { Document } from "mongoose";

export type TComic = {
  _id: string;
  title: string;
  description: string;
  thumbnail: {
    path: string;
    extension: string;
  };
};

export type TCharacters = {
  _id: string;
  name: string;
  description: string;
  thumbnail: {
    path: string;
    extension: string;
  };
  comics: TComic[];
};

// Définir l'interface utilisateur qui étend Document
export interface IUser extends Document {
  email: string;
  username: string;
  favorites: {
    characters: TCharacters[];
    comics: TComic[];
  };
  token: string;
  hash: string;
  salt: string;
}

// Créer une interface pour le document Mongoose qui étend `IUser` et ajoute les méthodes de document Mongoose
export interface IUserDocument extends IUser, Document {}
