const authOnlyMiddleware = require("../middlewares/authOnly");
const Bond = require("../models/Bond");
const Order = require("../models/Order");
const resolveOrder = require("../utils/resolveOrder");
const config = require("../config");
const router = require("express").Router();
const axios = require('axios');

router.get("/", async (req, res) => {
	res.json(await Order.find());
});

router.get("/mine", authOnlyMiddleware([]), async (req, res) => {
	res.json(await Order.find({ user: req.auth.user }).populate("bond"));
});

router.get("/mine/completed", authOnlyMiddleware([]), async (req, res) => {
	res.json(await Order.find({ user: req.auth.user, completed: true }));
});

router.get("/mine/pending", authOnlyMiddleware([]), async (req, res) => {
	res.json(await Order.find({ user: req.auth.user, completed: false }));
});


router.post("/", authOnlyMiddleware([]), async (req, res) => {
    const { bond, type, quantity, price, total_price, isFixed } = req.body;
    const authToken = req.headers.token;
    const userBalance = req.auth.user.balance;

    // Validation checks
    if (!bond || !type || !quantity || !price || !total_price || isFixed === undefined) {
        return res.status(400).json({
            error: true,
            msg: "Missing bond, type, quantity, price, isFixed, or total_price in request body",
            message: "Missing bond, type, quantity, price, isFixed, or total_price in request body",
        });
    }

    try {
        const orderBond = await Bond.findById(bond);
        if (!orderBond) {
            return res.status(404).json({
                error: true,
                msg: "Bond not found",
                message: "Bond not found",
            });
        }

        const sellDate = orderBond.maturityDate;
        const today = new Date();
        const maturityDate = new Date(sellDate);

        if (!sellDate || !(maturityDate instanceof Date)) {
            return res.status(400).json({
                error: true,
                msg: "Maturity date is missing or not a valid date object for the bond",
                message: "Maturity date is missing or not a valid date object for the bond",
                maturityDate: sellDate,
                maturityDateType: typeof sellDate
            });
        }

        // Log dates for debugging
        console.log("Today:", today);
        console.log("Maturity Date:", maturityDate);

        if (type === "buy") {
            if (price <= 0 || quantity <= 0 || total_price <= 0 || total_price > userBalance) {
                return res.status(400).json({
                    error: true,
                    msg: "Invalid order: check price, quantity, total price, and balance",
                    message: "Invalid order: check price, quantity, total price, and balance",
                });
            }
        } else if (type === "sell") {
            const response = await axios.get(`${config.endpoint.backendLocation}/bond/my-count/${bond}`, {
                headers: { token: authToken }
            });
            const ownedQuantity = response.data.count;

            if (quantity > ownedQuantity) {
                return res.status(400).json({
                    error: true,
                    msg: "Invalid sell order: quantity exceeds owned bonds",
                    message: "Invalid sell order: quantity exceeds owned bonds",
                });
            }

            // Ensure the condition that sell price must be lower than market price before maturity date
            if (today < maturityDate && price >= orderBond.price) {
                return res.status(400).json({
                    error: true,
                    msg: "Invalid sell order: sell price must be lower than market price before maturity date",
                    message: "Invalid sell order: sell price must be lower than market price before maturity date",
                });
            }
        }

        // Proceed to place the order if validation passes
        const lookingFor = type == "buy" ? "sell" : "buy";
        const orders = await Order.find({ bond, type: lookingFor });

        // using up all the market orders
        const marketOrders = orders.filter((order) => order.isFixed == false);
        while (quantity > 0 && marketOrders.length > 0) {
            quantity--;
            await resolveOrder(
                marketOrders.shift(),
                price ? price : orderBond.price[orderBond.price.length - 1],
                req.auth.user
            );
        }

        // using up all the fixed orders that satisfy the conditions
        let fixedOrders = orders.filter((order) => order.isFixed == true);
        if (type == "buy") {
            fixedOrders = fixedOrders.sort((a, b) => a.price - b.price);
        } else {
            fixedOrders = fixedOrders.sort((a, b) => b.price - a.price);
        }

        while (quantity > 0 && orders.length > 0) {
            if (fixedOrders.length > 0) {
                const comparingOrder = fixedOrders.shift();
                if (price) {
                    if (type == "buy" && price >= comparingOrder.price) {
                        quantity--;
                        await resolveOrder(
                            comparingOrder,
                            comparingOrder.price,
                            req.auth.user
                        );
                    } else if (type == "sell" && price <= comparingOrder.price) {
                        quantity--;
                        //await resolveOrder(comparingOrder, price, req.auth.user);
                        await resolveOrder(marketOrders.shift(), price ? price : orderBond.price[order]);

                    }
                } else {
                    quantity--;
                    await resolveOrder(comparingOrder, comparingOrder.price, req.auth.user);
                }
            } else {
                break;
            }
        }

        // if there are still orders left, create new orders
        const newOrders = Array(quantity)
            .fill(1)
            .map(() =>
                new Order({
                    bond,
                    type,
                    quantity: 1,
                    isFixed,
                    price,
                    total_price,
                    user: req.auth.user,
                })
            );

        // save the orders
        for (const order of newOrders) {
            await order.save();
        }

        res.status(200).json({
            msg: "Order placed successfully",
            message: "Order placed successfully",
        });
    } catch (error) {
        console.error("Error processing order:", error);
        res.status(500).json({
            error: true,
            msg: "Internal Server Error",
            message: "Error processing order",
        });
    }
});


module.exports = router;
