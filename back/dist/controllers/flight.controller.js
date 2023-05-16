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
exports.getRandomFlight = exports.getFlightById = exports.getAllFlights = void 0;
const firebase_1 = require("../firebase");
// [Route("api/flights")]
// [HttpGet]
exports.getAllFlights = ((request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const flightsRef = firebase_1.db.collection('flights');
        const flights = [];
        const snapshot = yield flightsRef.get();
        snapshot.forEach((doc) => {
            const flight = doc.data();
            flight.flightID = doc.id;
            flights.push(flight);
        });
        response.send(flights);
    }
    catch (error) {
        response.status(500).send(error);
    }
}));
// [HttpGet("{flightId}")]
exports.getFlightById = ((request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const flightRef = firebase_1.db.collection('flights').doc(request.params.flightId);
        const doc = yield flightRef.get();
        const data = doc.data();
        response.send(data);
    }
    catch (error) {
        response.status(500).send(error);
    }
}));
// [HttpGet("randomFlight")]
exports.getRandomFlight = ((request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const flightsRef = firebase_1.db.collection('flights');
        const flights = [];
        const snapshot = yield flightsRef.get();
        let count = 0;
        snapshot.forEach((doc) => {
            const flight = doc.data();
            flight.flightID = doc.id;
            if (flight.auctionStarted) {
                flights.push(flight);
                count++;
            }
        });
        const index = Math.floor(Math.random() * ((count - 1) - 0 + 1) + 0);
        response.send(flights[index]);
    }
    catch (error) {
        response.status(500).send(error);
    }
}));
//# sourceMappingURL=flight.controller.js.map