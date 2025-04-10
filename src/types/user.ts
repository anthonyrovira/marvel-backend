import { Document } from "mongoose";
import { TCharacters, TComic } from "./favorites";

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
  setPassword(password: string): void;
  validatePassword(password: string): boolean;
  generateJWT(): string;
}

export interface IUserDocument extends IUser, Document {}

export interface SignUpBody {
  email: string;
  username: string;
  password: string;
}

export interface SignInBody {
  email?: string;
  username?: string;
  password: string;
}

declare module "express" {
  interface Request {
    user?: Omit<IUser, "hash" | "salt">;
  }
}
