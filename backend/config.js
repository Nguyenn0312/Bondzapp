require("dotenv").config();

module.exports = {
	endpoint : {
		backendLocation: process.env.BACKEND_LOCATION || "http://localhost:5000",
	},
	server: {
		port: process.env.PORT || 5000,
	},
	db: {
		string: process.env.DB_STRING || "mongodb://127.0.0.1:27017",
		cleanInterval: 1000 * 60 * 5, // 5 min
	},
	idfy: {
		accountId: process.env.IDFY_ACCOUNT_ID,
		apiKey: process.env.IDFY_API_KEY,
	},
	mail: {
		credentials: {
			email: process.env.EMAIL,
			clientId: process.env.EMAIL_CLIENT_ID,
			clientSecret: process.env.EMAIL_CLIENT_SECRET,
			redirectURI: process.env.EMAIL_REDIRECT_URI,
			refreshToken: process.env.EMAIL_REFRESH_TOKEN,
		},
	},
	auth: {
		requiresEmailVerification: true,
		roles: {
			list: ["user" ,"admin"],
			default: "user",
		},
		otp: {
			length: 16,
			validFor: 1000 * 60 * 30, // 30 min
		},
		password: {
			length: {
				min: 8,
				max: 128,
			},
			hashingRounds: 10,
		},
		token: {
			validFor: 1000 * 60 * 60 * 24 * 7, // 1 week
			length: 32,
		},
	},
};
