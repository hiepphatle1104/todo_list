import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import compression from "compression";
import helmet from "helmet";
import dbConnect from "./database/db.js";
import { errorHandler } from "./middleware/errorHandler.js";
import routes from "./routes/init.js";
import cors from "cors";
import cookieParser from "cookie-parser";

// Initialize app
const app = express();
dotenv.config();

// Middlewares
app.use(morgan("dev"));
app.use(compression());
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173", // Thay bằng domain frontend
    credentials: true, // Cho phép gửi cookie qua
  })
);

// Database
dbConnect();

// Routes
app.use("/api", routes);

app.use(errorHandler);

export default app;
