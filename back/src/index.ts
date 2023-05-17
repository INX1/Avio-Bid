// const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/users');
const flightRoutes = require('./routes/flights');
const auctionRoutes = require('./routes/auctions');
const biddingRoutes = require('./routes/bidding');
const app = express();

app.use(express.json());
app.use(cors({
  origin: '*'
}));

app.use("/api/users", userRoutes);
app.use("/api/flights", flightRoutes);
app.use("/api/auctions", auctionRoutes);        
app.use("/api/bidding", biddingRoutes);

//app.use(express.static('../front/dist/front'));

app.listen(8080);

// exports.app = functions.https.onRequest(app);