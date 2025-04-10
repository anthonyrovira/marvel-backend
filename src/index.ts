import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import cors from "cors";
import * as dotenv from "dotenv";
import userRoutes from "./routes/userRoutes";
import favoritesRoutes from "./routes/favoritesRoutes";

dotenv.config();

const app = express();
app.use(cors());

mongoose.connect(process.env.MONGODB_URI as string, {
  autoIndex: true,
});

/* ROUTES */
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.use(userRoutes);
app.use(favoritesRoutes);
// import charactersRoute from "./routes/characters";
// app.use(charactersRoute);
// import comicsRoute from "./routes/comics";
// app.use(comicsRoute);

app.all("/{*splat}", (req: Request, res: Response) => {
  console.log("Route is not defined");
  res.status(400).json({ message: "Page not found" });
});

/* SERVER */
app.listen(process.env.PORT, () => {
  console.log(`Server has started on port ${process.env.PORT}`);
});
