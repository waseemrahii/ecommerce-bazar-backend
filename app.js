import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";

import globalErrorHandler from "./controllers/errorController.js";

// ROUTES
import userRoutes from "./routes/userRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Developing logging
if (process.env.NODE_ENV === "development") {
	app.use(morgan("dev"));
}

// API ROUTES
app.use("/api/users", userRoutes);

app.use("/", (req, res) => {
	res.send("Ecommerce Bazaar API is Running");
});

// Unhandle Routes Handling Middleware
app.all("*", (req, res, next) => {
	// AppError(message, statusCode)
	next(new AppError(`Can't find ${req.originalUrl} on this server.`, 404));
});

// GLOBAL ERROR HANDLING MIDDLEWARE
app.use(globalErrorHandler);

export default app;
