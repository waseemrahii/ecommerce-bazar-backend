import express from "express";

import { config } from "dotenv";

const app = express();

config({ path: ".env" });

const port = process.env.PORT || 4000;

app.use("/", (req, res, next) => {
	res.send("Ecommerce Bazaar API is Running");
});

app.listen(port, () => {
	console.log(`Server is listening on port ${port}`);
});
