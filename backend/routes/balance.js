const authOnlyMiddleware = require("../middlewares/authOnly");

const router = require("express").Router();

router.post("/add", authOnlyMiddleware([]), async (req, res) => {
	const { amount } = req.body;

	req.auth.user.balance += amount;
	res.json(await req.auth.user.save());
});

router.post("/remove", authOnlyMiddleware([]), async (req, res) => {
	const { amount } = req.body;

	req.auth.user.balance -= amount;
	res.json(await req.auth.user.save());
});

module.exports = router;
