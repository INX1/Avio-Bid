// import * as functions from 'firebase-functions';
import { Request, Response } from "express";
import { db } from '../firebase';

// [Route("api/flights")]

// [HttpGet]
export const getAllFlights = (async (request: Request, response: Response) => {
    try {
        const flightsRef = db.collection('flights');
        const flights: any = [];
        const snapshot = await flightsRef.get();
        snapshot.forEach((doc: any) => {
            const flight = doc.data();
            flight.flightID = doc.id;
            flights.push(flight);
        });
        response.send(flights);
    } catch (error) {
        response.status(500).send(error);
    }
});

// [HttpGet("{flightId}")]
export const getFlightById = (async (request: Request, response: Response) => {
    try {
        const flightRef = db.collection('flights').doc(request.params.flightId);
        const doc = await flightRef.get();
        const data = doc.data();
        response.send(data);
    } catch (error) {
        response.status(500).send(error);
    }
});

// [HttpGet("randomFlight")]
export const getRandomFlight = (async (request: Request, response: Response) => {
    try {
        const flightsRef = db.collection('flights');
        const flights: any = [];
        const snapshot = await flightsRef.get();
        let count = 0;
        snapshot.forEach((doc: any) => {
            const flight = doc.data();
            flight.flightID = doc.id;
            if(flight.auctionStarted){
                flights.push(flight);
                count++;
            }
        });
        const index = Math.floor(Math.random() * ((count - 1) - 0 + 1) + 0);
        response.send(flights[index]);
    } catch (error) {
        response.status(500).send(error);
    }
});