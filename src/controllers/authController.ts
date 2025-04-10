import { Request, Response } from "express";
import User from "../models/User";
import { SignInBody, SignUpBody } from "../types/user";

export const signUp = async (req: Request<{}, {}, SignUpBody>, res: Response) => {
  try {
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      res.status(409).json({ message: "Email or username already used" });
      return;
    }

    const newUser = new User({
      email,
      username,
      favorites: { characters: [], comics: [] },
    });

    newUser.setPassword(password);
    await newUser.save();

    const token = newUser.generateJWT();
    res.status(201).json({ token });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
    return;
  }
};

export const signIn = async (req: Request<{}, {}, SignInBody>, res: Response) => {
  try {
    const { email, username, password } = req.body;

    if (!password || (!email && !username)) {
      res.status(400).json({ message: "Missing credentials" });
      return;
    }

    const user = await User.findOne(email ? { email } : { username });
    if (!user || !user.validatePassword(password)) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const token = user.generateJWT();
    res.json({ token });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
    return;
  }
};

export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) res.status(404).json({ message: "User not found" });

    res.json({
      email: user?.email,
      username: user?.username,
      favorites: user?.favorites,
    });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
    return;
  }
};
