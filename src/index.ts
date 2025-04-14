import express, { Request, Response, NextFunction } from "express";
import bodyParser from "express";
import mongoose from "mongoose";
import cors from "cors";
import * as dotenv from "dotenv";
import userRoutes from "./routes/userRoutes";
import favoritesRoutes from "./routes/favoritesRoutes";

const allowedOrigins = [
  process.env.URL_FRONTEND_VITE, // Frontend production
  "http://localhost:5173", // Frontend development
];

dotenv.config();

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  cors({
    origin(origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (!allowedOrigins.includes(origin)) {
        console.error(`CORS error: Origin ${origin} not allowed.`);
        const msg = "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

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
