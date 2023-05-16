// import * as functions from 'firebase-functions';
import { Request, Response } from "express";
import { db } from '../firebase';

//GET: api/bidding/getBids
export const getBids =  (async (request: Request, response: Response) => {
    try {
        const bidstRef = db.collection('bidding').doc(request.params.roomID).collection('bids').orderBy('bid', 'desc');
        const bids: any = [];
        const snapshot = await bidstRef.get();

        snapshot.forEach((doc: any) => {
            bids.push(doc.data());
        })

        response.send(bids);
    } catch (error) {
        response.status(500).send(error);
    }
});

//POST: api/bidding/
export const setBid =  (async (request: Request, response: Response) => {
    try {
        const result = await db.collection('bidding').doc(request.body.roomID).collection('bids').add({ email: request.body.email, bid: request.body.bid });       
        if (result) {
            const res = await db.collection('auctions').doc(request.body.flightID).collection('rooms').doc(request.body.roomID).update({
                currentBid: request.body.bid
            });
            (res) ? response.send("The bid has been sucessfully added.") : response.status(400)
        } else response.send(undefined);
    } catch (error) {
        response.status(500).send(error);
    }
});