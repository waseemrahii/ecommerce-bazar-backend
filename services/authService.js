import jwt from "jsonwebtoken";
import { accessTokenExpiresIn, secret } from "../config/jwtConfig.js";

function generateAccessToken(userId) {
	return jwt.sign({ userId }, secret, {
		expiresIn: accessTokenExpiresIn,
	});
}

export async function loginService(user) {
	const accessToken = generateAccessToken(user._id);

	return { accessToken };
}
