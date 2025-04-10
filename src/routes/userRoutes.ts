import { Router } from "express";
import { getCurrentUser, signIn, signUp } from "../controllers/authController";
import { authenticate } from "../middlewares/authMiddleware";

const userRoutes = Router();

userRoutes.post("/signup", signUp);
userRoutes.post("/signin", signIn);
userRoutes.get("/me", authenticate, getCurrentUser);

export default userRoutes;
