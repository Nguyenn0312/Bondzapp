const router = require("express").Router();
const User = require("../models/User");
const authOnlyMiddleware = require("../middlewares/authOnly");
const filterData = require("../utils/filterData");
const config = require("../config");
const path = require('path');
const express = require('express');
const {saveUploadedFile, deleteFile } = require('../utils/uploadFile');

// get self
router.get("/self", authOnlyMiddleware([]), async (req, res) => {
	res.send(req.auth.user);
});
// get user by id
router.get("/:id", async (req, res) => {
	const user = await User.findById(req.params.id);
	if (!user) return res.status(404).json({ msg: "user not found" });
	res.json(user);
});
// get user by username
router.get("/byusername/:username", async (req, res) => {
	const user = await User.findOne({ username: req.params.username });
	if (!user) return res.status(404).json({ msg: "user not found" });
	res.json(user);
});
// get all users
router.get("/", authOnlyMiddleware(["admin"]), async (req, res) => {
	const users = await User.find();
	res.send(filterData(users, req.query));
});
// patch user
router.patch("/:id", authOnlyMiddleware(["admin"]), async (req, res) => {
	try {
		const user = await User.findById(req.params.id);

		if (!user) return res.status(404).json({ msg: "user not found" });

		const props = Object.getOwnPropertyNames(req.body);
		props.forEach((prop) => {
			user[prop] = req.body[prop];
		});
		res.json(await user.save());
	} catch (err) {
		res.status(500).json({ err });
	}
});
//upload the profile picture
const uploadDir = path.join(__dirname, '..', 'uploads', 'profilePic', );
router.post("/upload-avatar", authOnlyMiddleware([]), async (req, res) => {
    try {
        const acceptedExtensions = ['.txt', '.png', '.jpg'];
        const fileData = await saveUploadedFile(req, uploadDir);
        const fileExtension = path.extname(fileData.path);
        if (fileData.path.startsWith(uploadDir) && !acceptedExtensions.includes(fileExtension)) {
            await deleteFile(fileData.path); 
            return res.status(500).json({ err: "Error updating user profile picture, Invalid file extension" }); // Add return statement here
        }
        const filePath = `uploads/profilePic/${fileData.originalFilename}`;
        const userId = req.auth.user._id; 
        const user = await User.findByIdAndUpdate(userId, { profilePic: filePath }, { new: true });
        if (!user) {
            return res.status(404).json({ err: "User not found" });
        }
        res.json({
            message: "File uploaded and user updated successfully",
            profilePic: filePath,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ err: "Error updating user profile picture" });
        
    }
});

module.exports = router;


