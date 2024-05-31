const express = require("express");
const config = require("./config");
const mongoose = require("mongoose");
const cors = require("cors");
const authMiddleware = require("./middlewares/auth");
const tokenMiddleware = require("./middlewares/token");
const cleanDB = require("./utils/cleanDB");
const path = require('path');

const app = express();

// middlewares
app.use(express.json());
app.use(cors({ exposedHeaders: "token" }));
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
// custom middlewares
app.use(authMiddleware);
app.use(tokenMiddleware);

// connect to db
mongoose.connect(config.db.string, (err) => {
	if (err) console.error(err);
	else console.log("connected to db");
});

// Fetch news data daily
app.get('/service/news', async (req, res) => {
  try {
    const newsData = await getNewsData();
    res.json(newsData);
  } catch (error) {
    res.status(500).json({ error: 'Error getting news data' });
  }
});

// routes
app.use("/auth/", require("./routes/auth"));
app.use("/user/", require("./routes/user"));
app.use("/balance/", require("./routes/balance"));
app.use("/bond/", require("./routes/bond"));
app.use("/order/", require("./routes/order"));
app.use("/analysis/", require("./routes/analysis"));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.listen(config.server.port, "0.0.0.0", () => {
	console.log(`server live on port ${config.server.port}`);
});


// clean DB
setTimeout(cleanDB, config.db.cleanInterval);
