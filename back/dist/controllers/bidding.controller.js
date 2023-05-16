"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setBid = exports.getBids = void 0;
const firebase_1 = require("../firebase");
//GET: api/bidding/getBids
exports.getBids = ((request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bidstRef = firebase_1.db.collection('bidding').doc(request.params.roomID).collection('bids').orderBy('bid', 'desc');
        const bids = [];
        const snapshot = yield bidstRef.get();
        snapshot.forEach((doc) => {
            bids.push(doc.data());
        });
        response.send(bids);
    }
    catch (error) {
        response.status(500).send(error);
    }
}));
//POST: api/bidding/
exports.setBid = ((request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield firebase_1.db.collection('bidding').doc(request.body.roomID).collection('bids').add({ email: request.body.email, bid: request.body.bid });
        if (result) {
            const res = yield firebase_1.db.collection('auctions').doc(request.body.flightID).collection('rooms').doc(request.body.roomID).update({
                currentBid: request.body.bid
            });
            (res) ? response.send("The bid has been sucessfully added.") : response.status(400);
        }
        else
            response.send(undefined);
    }
    catch (error) {
        response.status(500).send(error);
    }
}));
//# sourceMappingURL=bidding.controller.js.map