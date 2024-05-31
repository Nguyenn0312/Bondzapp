const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");
const Token = require("../models/Token");
const OTP = require("../models/OTP");
const sendMail = require("../utils/sendMail");
const config = require("../config");
const getRandomString = require("../utils/getRandomString");
const authOnlyMiddleware = require("../middlewares/authOnly");
const saveUploadedFile = require('../utils/uploadFile');
const parseMultipartData = require('../utils/parseMultipartData');
const kyc = require("../utils/kyc");
const express = require('express');
const path = require('path');
const fs = require('fs');


function validatePassword(password) {
	return !(
		password.length < config.auth.password.length.min ||
		password > config.auth.password.length.max
	);
}

// register
router.post("/register", async (req, res) => {
	const user = req.body;

	// missing details
	if (!user) return res.status(400).json({ msg: "missing user in body" });
	if (!(user.username && user.password && user.email && user.phone))
		return res.status(400).json({
			msg: "missing username, password, email, phone",
		});

	// invalid details
	if ((await User.find({ username: user.username })).length > 0)
		return res.status(400).json({ msg: "username is taken" });
	if ((await User.find({ email: user.email })).length > 0)
		return res.status(400).json({
			msg: "this email address is already registered with another account",
		});
	if ((await User.find({ phone: user.phone })).length > 0)
		return res.status(400).json({
			msg: "this phone no is already registered with another account",
		});

	if (!validatePassword(user.password))
		return res.status(400).json({
			err: `password should be between ${config.auth.password.length.min} and ${config.auth.password.length.max} characters`,
		});

	try {
		// hashing password
		const salt = bcrypt.genSaltSync(config.auth.password.hashingRounds);
		user.password = bcrypt.hashSync(user.password, salt);

		const newUser = new User(user);
		return res.send(await newUser.save());
	} catch (err) {
		return res.status(500).json({ err });
	}
});

// checking  if user exists
router.get("/exists/:username", async (req, res) => {
	const foundUsers = await User.find({ username: req.params.username });
	if (foundUsers.length === 0) return res.json({ exists: false });
	else
		return res.json({
			exists: true,
			id: foundUsers[0]._id,
		});
});

// login
router.post("/login", async (req, res) => {
	const user = req.body;
	// missing details
	if (!user) return res.status(400).json({ msg: "missing user in body" });
	if (!(user.email && user.password))
		return res.status(400).json({ msg: "missing email or password" });
	// looking for user
	const foundUsers = await User.find({ email: user.email });
	if (foundUsers.length === 0)
		return res.status(404).json({ msg: "user not found" });
	const foundUser = foundUsers[0];
	// checking verification
	if (config.auth.requiresEmailVerification) {
		if (!foundUser.verified)
			return res.status(403).json({
				msg: "you must complete kyc before logging in", 
				user: foundUser.email
			});
	}
	// comparing passwords
	if (!bcrypt.compareSync(user.password, foundUser.password))
		return res.status(400).json({ msg: "incorrect password", user: foundUser.email});
	// generating token
	let tokenValue = "";
	while (true) {
		tokenValue = getRandomString(config.auth.token.length);
		const tokens = await Token.find({ value: tokenValue });
		if (tokens.length === 0) break;
	}

	const token = new Token({ value: tokenValue, user: foundUser, ip: req.ip });
	await token.save();

	res.json({ token: tokenValue });
});

// change role of user
router.post("/role/:id", authOnlyMiddleware(["admin"]), async (req, res) => {
	const role = req.body.role;
	if (!role || !config.auth.roles.list.includes(role))
		return res.status(400).json({ msg: "missing or invalid role" });

	const user = await User.findById(req.params.id);

	if (!user) return res.status(404).json({ msg: "user not found" });

	user.role = role;
	res.json(await user.save());
});

// generate otp
router.post("/generate-otp", async (req, res) => {
	const user = req.body;

	// missing details
	if (!user) return res.status(400).json({ msg: "missing user in body" });
	if (!user.email) return res.status(400).json({ msg: "missing email" });

	// finding user with email
	const foundUser = await User.findOne({ email: user.email });

	if (!foundUser)
		return res
			.status(404)
			.json({ msg: `no user registered with email ${user.email}` });

	// generate otp
	try {
		const otp = getRandomString(config.auth.otp.length);
		const newOTP = new OTP({
			value: otp,
			user: foundUser,
		});
		newOTP.save();

		// sending otp
		const emailBody = `Hello ${foundUser.username}
		<hr />
		Your OTP is <em>${otp}</em>
		<br />
		It is valid for 30 min after generation. i.e till ${newOTP.validTill}`;

		await sendMail(foundUser.email, "One Time Password", emailBody);
		res.json({ msg: `OTP sent to ${foundUser.email}` });
	} catch (err) {
		return res
			.status(500)
			.json({ msg: "error generating and sending OTP" });
	}
});

// reset password
router.post("/reset-password", async (req, res) => {
	const password = req.body.password;
	const email = req.body.email;
	const otp = req.body.otp;

	if (!(password && otp && email))
		return res.status(400).json({ msg: "missing password, email or otp" });

	if (!validatePassword(password))
		return res.status(400).json({
			err: `password should be between ${config.auth.password.length.min} and ${config.auth.password.length.max} characters`,
		});

	// finding otp
	const foundOTP = await OTP.findOne({ value: otp });

	if (!foundOTP) return res.status(400).json({ msg: "invalid otp" });

	const user = await User.findById(foundOTP.user);

	if (user.email != email)
		return res.status(400).json({ msg: "invalid otp" });

	const salt = bcrypt.genSaltSync(config.auth.password.hashingRounds);
	user.password = bcrypt.hashSync(password, salt);

	res.json(await user.save());
});

// verify
const uploadDir = path.join(__dirname, '..', 'uploads', 'PanImg');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

router.post("/verify", async (req, res) => {
    try {
        const { fields, files } = await parseMultipartData(req);
        if (!fields.username || !fields.name || !fields.pan || !files.file) {
            return res.status(400).json({ msg: "Missing fields: username, name, pan, or file" });
        }
        const user = await User.findOne({ username: fields.username });
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }
        if (!kyc(fields.name, fields.pan)) {
            return res.status(400).json({ msg: "Invalid details. KYC failed." });
        }
        
        user.verified = true;
        user.name = fields.name;
        user.pan = fields.pan;
        user.panImg = `uploads/PanImg/${files.file.name.replace(/\s/g, '_')}`;
        await user.save();
        res.json({ msg: "User verified successfully", user });
    } catch (error) {
        console.error("Error in /verify route:", error);
        res.status(500).json({ msg: "Error processing request", error: error.message });
    }
});


router.get('/uploads/PanImg/:imageName', (req, res) => {
    const imagePath = path.resolve(__dirname, '..', 'uploads', 'PanImg', req.params.imageName);

    res.sendFile(imagePath, (err) => {
        if (err) {
            console.error("Error sending file:", err);
            return res.status(404).send('File not found');
        }
    });
});


module.exports = router;
