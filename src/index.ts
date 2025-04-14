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

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (
      allowedOrigins.some(
        (allowedOrigin) => origin === allowedOrigin || origin.startsWith((allowedOrigin || "").replace(/\/$/, ""))
      )
    ) {
      return callback(null, true);
    }

    console.log(`CORS policies has blocked this origin: ${origin}`);
    return callback(new Error("Access denied by CORS policies"), false);
  },
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
};

app.use(cors(corsOptions));

mongoose.connect(process.env.MONGODB_URI as string, {
  autoIndex: true,
});

/* ROUTES */
app.use(userRoutes);
app.use(favoritesRoutes);

app.all("/{*splat}", (req: Request, res: Response) => {
  console.log("Route is not defined");
  res.status(400).json({ message: "Page not found" });
});

/* SERVER */
app.listen(process.env.PORT, () => {
  console.log(`Server has started on port ${process.env.PORT}`);
});
