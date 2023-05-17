// import * as functions from 'firebase-functions';
import { Request, Response } from "express";
import { db } from '../firebase';
const nodemailer = require('nodemailer');
// [Route("api/auctions")]

// [HttpGet("{flightId}")]
export const getRoomsByFlight =  (async (request: Request, response: Response) => {
    try {
        const auctionsRef = db.collection('auctions').doc(request.params.flightId);       // auctionID = flightID
        const roomsRef = auctionsRef.collection('rooms');
        const rooms: any = [];
        const snapshot = await roomsRef.get();
        snapshot.forEach((doc: any) => {
            const room = doc.data();
            room.roomID = doc.id;
            rooms.push(room);
        });
        response.send(rooms);
    } catch (error) {
        response.status(500).send(error);
    }
});

// [HttpPost]
export const setAuctionForFlight = (async (request: Request, response: Response) => {
    try {
        const auctionsRef = db.collection('auctions').doc(request.params.flightId).collection('rooms');
        const number = request.body.number;
        for (let i = 0; i < number; i++) {
            const result = await auctionsRef.add({ currentBid: request.body.minCost, time: request.body.time });
            if (!result) response.status(500).send("Error");
        }
        const result2 = await db.collection('flights').doc(request.params.flightId).update({
            auctionStarted: true
        });
        if(result2) {
            const usersRef = await db.collection('users').where('flightID', '==', request.params.flightId).get();
            usersRef.forEach((doc: any)  => {
                sendMailBuyNewCard(doc.id, doc.data().name, request.params.flightId);
            });
          
            response.status(200).send("Active: true");
        }else{
            response.status(400).send("BAD REQUEST");
        } 

    } catch (error) {
        response.status(500).send(error);
    }
});

// [HttpPost("closeAuction/auctionId")]
export const closeAuction = (async (request: Request, response: Response) => {
    try {
        const result = await db.collection('flights').doc(request.params.auctionId).update({
            auctionStarted: false
        });    
        (result) ? response.status(200).send("Active: false") : response.status(400).send("BAD REQUEST");
    } catch (error) {
        response.status(500).send(error);
    }
});



// [HttpDelete("auctionID")]
async function deleteQueryBatch(dbs: any, query: any, resolve: any) {
    const snapshot = await query.get();

    const batchSize = snapshot.size;
    if (batchSize === 0) {
        // When there are no documents left, we are done
        resolve();
        return;
    }

    // Delete documents in a batch
    const batch = dbs.batch();
    snapshot.docs.forEach((doc: any) => {
        batch.delete(doc.ref);
    });
    await batch.commit();

    // Recurse on the next process tick, to avoid
    // exploding the stack.
    process.nextTick(() => {
        // tslint:disable-next-line: no-floating-promises
        deleteQueryBatch(dbs, query, resolve);
    });
}


export const deleteAuctionById = (async (request: Request, response: Response) => {

    const collectionRef = db.collection('auctions').doc(request.params.auctionId).collection('rooms');
    const rooms: any = [];
    const snapshot = await collectionRef.get();
    snapshot.forEach((doc: any) => {
        rooms.push(doc.id);
    });
    return new Promise((resolve, reject) => {
        deleteQueryBatch(db, collectionRef, resolve).then(async ()=>{
            try {
                console.log(request.params.auctionId);
                const auctionRef = db.collection('auctions').doc(request.params.auctionId);
                const result = await auctionRef.delete();
                (result) ? response.status(200).send("Auction has been successfully deleted.") : response.status(400).send("BAD REQUEST");
            } catch (error) {
                console.log(error);
            }
        }).catch(reject);
    });
});


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'acaperin356@gmail.com',
        pass: 'milance356'
    }
});

export function sendMailBuyNewCard(email: string, name: string, flightID: string){
    
    const mailOptions = {
        from: 'Auctions', 
        to: email,
        subject: 'Available auctions for business class plane tickets',
        html: `<body>
                <h1 style="font-family:'verdana'">Business class tickets on sale!</h1>
                <hr>
                <p>Dear `+ name + `,</p>
                <p style="font-family:'verdana'">A unique opportunity to upgrade your economic class plane ticket to a business class plane ticket. Take part in an auction and get a chance to win a business class plane ticket for 50% off or more. As long as you wait, there is a bigger chance for someone else to grab that ticket. Due to that, hurry up and good luck!</p>
                <br>
                <a href="https://aukcija-edit-2020.web.app/auctions/`+ flightID +`/`+ email +`">https://aukcija-edit-2020.web.app/`+ flightID +`/`+ email +`</a>
                <br><br><br>
                <center><img src="https://linkpicture.com/q/logo_69.png" alt="Aer Lingus" width="320" height="321"></center>
                </body>`
    };
    
    return transporter.sendMail(mailOptions, (erro : any, info : any) => {
        if(erro){
            console.log(erro.toString());
        }
        console.log('Sended');
    });
}
