import mongoose from "mongoose";
import config from "./index.js";

mongoose.set("strictQuery", false);

const connectDB = async () => {
	try {
		console.log("Mongodb connection start");
		const connect = await mongoose.connect(config.dbURI);

		console.log(`Mongodb connected: ${connect.connection.host}`);
	} catch (error) {
		console.log(`Error: ${error.message}`);
	}
};

export default connectDB;
