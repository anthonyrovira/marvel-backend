import express, { Request, Response, NextFunction } from "express";
import formidable from "express-formidable";
import mongoose from "mongoose";
import cors from "cors";
import * as dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(formidable());
app.use(cors());

mongoose.connect(process.env.MONGODB_URI as string, {
  autoIndex: true,
});

/* ROUTES */
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

// Assurez-vous que vos fichiers de routes sont également convertis en TypeScript
import userRoutes from "./routes/user";
app.use(userRoutes);
import favoritesRoutes from "./routes/favorites";
app.use(favoritesRoutes);
import charactersRoute from "./routes/characters";
app.use(charactersRoute);
import comicsRoute from "./routes/comics";
app.use(comicsRoute);

app.all("*", (req: Request, res: Response) => {
  console.log("Route is not defined");
  res.status(400).json({ message: "Page not found" });
});

/* SERVER */
app.listen(process.env.PORT, () => {
  console.log(`Server has started on port ${process.env.PORT}`);
});
