// import * as functions from 'firebase-functions';
import { Request, Response } from "express";
import { db } from '../firebase';
const cors = require('cors')({origin: true});
const nodemailer = require('nodemailer');
//import { response, request } from 'express';

// [Route("api/users")]

// [HttpGet]
export const getAllUsers = (async (_request: Request, _response: Response)  => {
    try {
        const usersRef = db.collection('users');
        const users: any = [];
        const snapshot = await usersRef.get();
        snapshot.forEach((doc: any) => {
            const user = doc.data();
            user.email = doc.id;  // userID
            users.push(user);
        });
        // _response.setHeader("Access-Control-Allow-Origin", "*");
        // _response.setHeader('Access-Control-Allow-Methods', '*');
        // _response.setHeader("Access-Control-Allow-Headers", "*");
        _response.send(users);
    } catch (error) {
        _response.status(500).send(error);
    }
});

// [HttpGet("{userId}")]
export const getUserById = (async (_request: Request, _response: Response)  => {
    try {
        const userRef = db.collection('users').doc(_request.params.userId);
        const snapshot = await userRef.get();
        _response.send(snapshot.data());
    } catch (error) {
        _response.status(500).send(error);
    }
});

// [HttpPost]
export const setUser = (async (_request: Request, _response: Response)  => {
    try {
        const result = await db.collection('users').doc(_request.body.email).set({name: _request.body.name ?? "", flightID: _request.body.flightID ?? ""});
        (result) ? _response.send("The user has been sucessfully added.") : _response.send(undefined);

        //sendMailBuyNewCard(_request.body.email, _request.body.name, _request.body.flightID);
    } catch (error) {
        _response.status(500).send(error);
    }
});

// [HttpDelete("{userId}")]
export const deleteUserById = (async (_request: Request, _response: Response)  => {
    try {
        const userRef = db.collection('users').doc(_request.params.userId);
        const result = await userRef.delete();
        (result) ? _response.status(200).send("The user has been successfully deleted.") : _response.status(400).send("BAD REQUEST");
    } catch (error) {
        _response.status(500).send(error);
    }
});

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'acaperin356@gmail.com',
        pass: 'milance356'
    }
});

function sendMailBuyNewCard(email: string, name: string, flightID: string){
    
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
                <center><img src="https://linkpicture.com/q/logo_69.png" alt="/" width="600" height="152"></center>
                </body>`
    };
    
    return transporter.sendMail(mailOptions, (erro : any, info : any) => {
        if(erro){
            console.log(erro.toString());
        }
        console.log('Sended');
    });
}


export const probaMail = (async (request: Request, response: Response) => {
    
    cors(request, response, () => {
        const email = request.body.email;
        
    
        const mailOptions = {
            from: 'Aca Perin <acaperin356@gmail.com>', 
            to: email,
            subject: 'Available auctions for a business class ticket',
            html: `<body>
                    <h1 style="font-family:'verdana'">Business class tickets on sale!</h1>
                    <hr>
                    <p style="font-family:'verdana'">A unique opportunity to upgrade your economic class ticket to a business class ticket. Take part in an auction and get a chance to win a business class ticket for 50% off or more. As long as you wait, there is a bigger chance for someone else to grab that ticket. Due to that, hurry up and good luck!</p>
                    <br>
                    <a href="https://www.youtube.com/"><p style="color:DodgerBlue;"><font size = "4">Just click on this link :)</font></p></a>
                    <br><br><br>
                    <center><img src="https://www.logo-designer.co/wp-content/uploads/2019/01/2019-aer-lingus-new-logo-design-aircraft-livery-brand-refresh.png" alt="Aer Lingus" width="320" height="321"></center>
                    </body>`
        };
        
        return transporter.sendMail(mailOptions, (erro : any, info : any) => {
            if(erro){
                return response.send(erro.toString());
            }
            return response.send('Sended');
        });
    })
  });