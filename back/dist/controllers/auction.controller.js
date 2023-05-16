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
exports.deleteAuctionById = exports.closeAuction = exports.setAuctionForFlight = exports.getRoomsByFlight = void 0;
const firebase_1 = require("../firebase");
const nodemailer = require('nodemailer');
// [Route("api/auctions")]
// [HttpGet("{flightId}")]
exports.getRoomsByFlight = ((request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const auctionsRef = firebase_1.db.collection('auctions').doc(request.params.flightId); // auctionID = flightID
        const roomsRef = auctionsRef.collection('rooms');
        const rooms = [];
        const snapshot = yield roomsRef.get();
        snapshot.forEach((doc) => {
            const room = doc.data();
            room.roomID = doc.id;
            rooms.push(room);
        });
        response.send(rooms);
    }
    catch (error) {
        response.status(500).send(error);
    }
}));
// [HttpPost]
exports.setAuctionForFlight = ((request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const auctionsRef = firebase_1.db.collection('auctions').doc(request.params.flightId).collection('rooms');
        const number = request.body.number;
        for (let i = 0; i < number; i++) {
            const result = yield auctionsRef.add({ currentBid: request.body.minCost, time: request.body.time });
            if (!result)
                response.status(500).send("Error");
        }
        const result2 = yield firebase_1.db.collection('flights').doc(request.params.flightId).update({
            auctionStarted: true
        });
        if (result2) {
            const usersRef = yield firebase_1.db.collection('users').where('flightID', '==', request.params.flightId).get();
            usersRef.forEach((doc) => {
                sendMailBuyNewCard(doc.id, doc.data().name, request.params.flightId);
            });
            response.status(200).send("Active: true");
        }
        else {
            response.status(400).send("BAD REQUEST");
        }
    }
    catch (error) {
        response.status(500).send(error);
    }
}));
// [HttpPost("closeAuction/auctionId")]
exports.closeAuction = ((request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield firebase_1.db.collection('flights').doc(request.params.auctionId).update({
            auctionStarted: false
        });
        (result) ? response.status(200).send("Active: false") : response.status(400).send("BAD REQUEST");
    }
    catch (error) {
        response.status(500).send(error);
    }
}));
// [HttpDelete("auctionID")]
function deleteQueryBatch(dbs, query, resolve) {
    return __awaiter(this, void 0, void 0, function* () {
        const snapshot = yield query.get();
        const batchSize = snapshot.size;
        if (batchSize === 0) {
            // When there are no documents left, we are done
            resolve();
            return;
        }
        // Delete documents in a batch
        const batch = dbs.batch();
        snapshot.docs.forEach((doc) => {
            batch.delete(doc.ref);
        });
        yield batch.commit();
        // Recurse on the next process tick, to avoid
        // exploding the stack.
        process.nextTick(() => {
            // tslint:disable-next-line: no-floating-promises
            deleteQueryBatch(dbs, query, resolve);
        });
    });
}
exports.deleteAuctionById = ((request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const collectionRef = firebase_1.db.collection('auctions').doc(request.params.auctionId).collection('rooms');
    const rooms = [];
    const snapshot = yield collectionRef.get();
    snapshot.forEach((doc) => {
        rooms.push(doc.id);
    });
    return new Promise((resolve, reject) => {
        deleteQueryBatch(firebase_1.db, collectionRef, resolve).then(() => __awaiter(void 0, void 0, void 0, function* () {
            try {
                console.log(request.params.auctionId);
                const auctionRef = firebase_1.db.collection('auctions').doc(request.params.auctionId);
                const result = yield auctionRef.delete();
                (result) ? response.status(200).send("Auction has been successfully deleted.") : response.status(400).send("BAD REQUEST");
            }
            catch (error) {
                console.log(error);
            }
        })).catch(reject);
    });
}));
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'acaperin356@gmail.com',
        pass: 'milance356'
    }
});
function sendMailBuyNewCard(email, name, flightID) {
    const mailOptions = {
        from: 'Auctions',
        to: email,
        subject: 'Available auctions for business class plane tickets',
        html: `<body>
                <h1 style="font-family:'verdana'">Business class tickets on sale!</h1>
                <hr>
                <p>Dear ` + name + `,</p>
                <p style="font-family:'verdana'">A unique opportunity to upgrade your economic class plane ticket to a business class plane ticket. Take part in an auction and get a chance to win a business class plane ticket for 50% off or more. As long as you wait, there is a bigger chance for someone else to grab that ticket. Due to that, hurry up and good luck!</p>
                <br>
                <a href="https://aukcija-edit-2020.web.app/auctions/` + flightID + `/` + email + `">https://aukcija-edit-2020.web.app/` + flightID + `/` + email + `</a>
                <br><br><br>
                <center><img src="https://linkpicture.com/q/logo_69.png" alt="Aer Lingus" width="320" height="321"></center>
                </body>`
    };
    return transporter.sendMail(mailOptions, (erro, info) => {
        if (erro) {
            console.log(erro.toString());
        }
        console.log('Sended');
    });
}
//# sourceMappingURL=auction.controller.js.map