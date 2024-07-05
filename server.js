import express from "express";
import connectDB from "./config/db.js";

import config from "./config/index.js";

console.log(config);

const app = express();

connectDB();

const port = process.env.PORT || 4000;

app.use("/", (req, res, next) => {
	res.send("Ecommerce Bazaar API is Running");
});

app.listen(port, () => {
	console.log(`Server is listening on port ${port}`);
});
