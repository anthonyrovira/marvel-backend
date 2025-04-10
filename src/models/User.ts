import mongoose, { Schema } from "mongoose";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { IUser } from "../types/user";

// Schéma Mongoose pour le modèle User
const UserSchema: Schema<IUser> = new Schema({
  email: { type: String, unique: true, required: true },
  username: { type: String, unique: true, required: true },
  favorites: {
    characters: { type: [Object], required: true },
    comics: { type: [Object], required: true },
  },
  token: { type: String },
  hash: { type: String },
  salt: { type: String },
});

UserSchema.methods.setPassword = function (password: string) {
  this.salt = crypto.randomBytes(16).toString("hex");
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, "sha512").toString("hex");
};

UserSchema.methods.validatePassword = function (password: string) {
  const hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, "sha512").toString("hex");
  return this.hash === hash;
};

UserSchema.methods.generateJWT = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
    },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  );
};

const User = mongoose.model<IUser>("User", UserSchema);
export default User;
