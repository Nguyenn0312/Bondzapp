const express = require('express');
const router = express.Router();
const Bond = require('../models/Bond');
const Order = require('../models/Order');
const User = require('../models/User');
const authOnlyMiddleware = require('../middlewares/authOnly');

// Middleware for manager/admin routes
const adminOnlyMiddleware = authOnlyMiddleware(['admin']);
const managerOnlyMiddleware = authOnlyMiddleware(['manager']);

// Utility function to calculate average price
const calculateAveragePrice = (orders) => {
    const total = orders.reduce((acc, order) => acc + order.total_price, 0);
    return orders.length ? total / orders.length : 0;
};

// Get overall transaction performance
router.get('/performance', adminOnlyMiddleware, async (req, res) => {
    try {
        const completedOrders = await Order.find({ completed: true });
        const totalOrders = completedOrders.length;
        const totalAmount = completedOrders.reduce((acc, order) => acc + order.total_price, 0);
        const averageOrderValue = calculateAveragePrice(completedOrders);

        res.json({
            totalOrders,
            totalAmount,
            averageOrderValue
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get user's transaction performance
router.get('/user-performance', authOnlyMiddleware([]), async (req, res) => {
    try {
        const userId = req.auth.user._id;
        const userOrders = await Order.find({ user: userId, completed: true });
        const totalOrders = userOrders.length;
        const totalAmount = userOrders.reduce((acc, order) => {
            if (typeof order.total_price === 'number') {
              return acc + order.total_price;
            } else {
              console.warn(`Invalid total_price for order ${order._id}:`, order.total_price);
              return acc;
            }
          }, 0);
        const averageOrderValue = totalOrders > 0 ? totalAmount / totalOrders : 0;
        console.log('Total Amount:', totalAmount);
        console.log('Average Order Value:', averageOrderValue);
        res.json({
            totalOrders,
            totalAmount,
            averageOrderValue
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/bond/maturity', authOnlyMiddleware([]), async (req, res) => {
    try {
        const userId = req.auth.user._id;
        const orders = await Order.find({ user: userId, completed: true, type: 'buy' }).populate('bond');

        const bondMaturityMap = {};

        for (const order of orders) {
            const bond = await Bond.findById(order.bond);
            if (!bond) continue;
            const bondId = bond._id.toString();
            const couponRate = bond.couponrate;
            if (!bondMaturityMap[bondId]) {
                bondMaturityMap[bondId] = {
                    bondId: bond._id,
                    bondName: bond.symbol,
                    totalQuantity: 0,
                    totalBuyPrice: 0,
                    totalCouponAmount: 0,
                    totalAmountAtMaturity: 0
                };
            }
            bondMaturityMap[bondId].totalQuantity += order.quantity;
            bondMaturityMap[bondId].totalBuyPrice += order.quantity * order.price;
            bondMaturityMap[bondId].totalCouponAmount += (couponRate / 100) * (order.quantity * order.price);
            bondMaturityMap[bondId].totalAmountAtMaturity = bondMaturityMap[bondId].totalBuyPrice + bondMaturityMap[bondId].totalCouponAmount;
        }

        const bondMaturityData = Object.values(bondMaturityMap);
        res.json(bondMaturityData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



// Get bond trading efficiency
router.get('/efficiency/bond/:bondId', async (req, res) => {
    try {
        const { bondId } = req.params;
        const bondOrders = await Order.find({ bond: bondId, completed: true });

        const buyOrders = bondOrders.filter(order => order.type === 'buy');
        const sellOrders = bondOrders.filter(order => order.type === 'sell');

        const averageBuyPrice = calculateAveragePrice(buyOrders);
        const averageSellPrice = calculateAveragePrice(sellOrders);

        res.json({
            totalTrades: bondOrders.length,
            totalBuys: buyOrders.length,
            totalSells: sellOrders.length,
            averageBuyPrice,
            averageSellPrice,
            efficiency: averageSellPrice - averageBuyPrice
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get user bond trading efficiency
router.get('/efficiency/user/:userId', authOnlyMiddleware([]), async (req, res) => {
    try {
        const { userId } = req.params;
        const userOrders = await Order.find({ user: userId, completed: true });

        const buyOrders = userOrders.filter(order => order.type === 'buy');
        const sellOrders = userOrders.filter(order => order.type === 'sell');

        const averageBuyPrice = calculateAveragePrice(buyOrders);
        const averageSellPrice = calculateAveragePrice(sellOrders);

        res.json({
            totalTrades: userOrders.length,
            totalBuys: buyOrders.length,
            totalSells: sellOrders.length,
            averageBuyPrice,
            averageSellPrice,
            efficiency: averageSellPrice - averageBuyPrice
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

const WebSocket = require('ws');

const app = express();
const server = app.listen(5050, () => {
  console.log('Server started on port 5050');
});

// Set up WebSocket server
const wss = new WebSocket.Server({ server });

// Store comments in memory
const comments = [];

// WebSocket connection handler
wss.on('connection', (ws) => {
  // Send existing comments to the connected client
  ws.send(JSON.stringify(comments));

  // Handle incoming messages from the client
  ws.on('message', (message) => {
    const comment = JSON.parse(message);
    comments.push(comment);

    // Broadcast the new comment to all connected clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(comment));
      }
    });
  });
});
// Get all users' trading data (admin only)
app.post('/publish-comment', (req, res) => {
    try {
      const comment = req.body.comment;
      const newComment = { id: generateCommentId(), text: comment };

      // Add the new comment to the in-memory storage
      comments.push(newComment);
      // Broadcast the new comment to all connected WebSocket clients
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(newComment));
        }
      });
  
      res.json({ message: 'Comment published successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

module.exports = router;
