import jwt from "jsonwebtoken";
import config from "../config/index.js";

function generateAccessToken(userId) {
	return jwt.sign({ userId }, config.jwtSecret, {
		expiresIn: config.jwtAccessTime,
	});
}

export async function loginService(user) {
	const accessToken = generateAccessToken(user._id);

	return { accessToken };
}
