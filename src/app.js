import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import compression from "compression";
import helmet from "helmet";
import dbConnect from "./database/db.js";
import { errorHandler } from "./middleware/errorHandler.js";
import routes from "./routes/init.js";

// Initialize app
const app = express();
dotenv.config();

// Middlewares
app.use(morgan("dev"));
app.use(compression());
app.use(helmet());
app.use(express.json());

// Database
dbConnect();

// Routes
app.use("/api", routes);

app.use(errorHandler);

export default app;
