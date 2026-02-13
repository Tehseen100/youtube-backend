import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js"
import errorHandler from "./middlewares/error.middleware.js";
import notFound from "./middlewares/notFound.middleware.js";

const app = express();

// Middlewares
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Routes
app.use("/api/v1/auth", authRoutes);

// Not found middleware
app.use(notFound);

// Error handler middleware
app.use(errorHandler);

export default app;