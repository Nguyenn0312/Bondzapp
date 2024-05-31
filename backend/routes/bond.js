const authOnlyMiddleware = require("../middlewares/authOnly");
const Bond = require("../models/Bond");
const Order = require("../models/Order");
const router = require("express").Router();

router.get("/", async (req, res) => {
	res.json(await Bond.find());
});

router.get("/my-count/:id", authOnlyMiddleware([]), async (req, res) => {
	const orders = await Order.find({
		user: req.auth.user,
		bond: req.params.id,
		completed: true,
	});
	let count = 0;
	orders.forEach((order) => {
		if (order.type == "buy") count++;
		else count--;
	});
	res.json({ count });
});

// Get the latest bonds
router.get("/latest", async (req, res) => {
    const latestBonds = await Bond.find().sort({ createdAt: -1 }).limit(10);
    res.json(latestBonds);
});

// Upload bond data
router.post("/upload", authOnlyMiddleware(['admin']), async (req, res) => {
    const newBond = new Bond(req.body);
    await newBond.save();
    res.json(newBond);
});

// Subtract bonds volume after a successful transaction
router.post("/subtract-volume/:id", authOnlyMiddleware([]), async (req, res) => {
    const bond = await Bond.findById(req.params.id);
    if (!bond) {
        return res.status(404).json({ error: "Bond not found" });
    }
    bond.volume -= req.body.volume;
    await bond.save();
    res.json(bond);
});

// Add bonds volume when a bond is sold at maturity
router.post("/add-volume/:id", authOnlyMiddleware([]), async (req, res) => {
    const bond = await Bond.findById(req.params.id);
    if (!bond) {
        return res.status(404).json({ error: "Bond not found" });
    }
    bond.volume += req.body.volume;
    await bond.save();
    res.json(bond);
});

// Release a new bond
router.post("/release", authOnlyMiddleware(['admin']), async (req, res) => {
    const newBond = new Bond(req.body);
    await newBond.save();
    res.json(newBond);
});


module.exports = router;