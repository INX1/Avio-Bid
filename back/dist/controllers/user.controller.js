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
exports.probaMail = exports.deleteUserById = exports.setUser = exports.getUserById = exports.getAllUsers = void 0;
const firebase_1 = require("../firebase");
const cors = require('cors')({ origin: true });
const nodemailer = require('nodemailer');
//import { response, request } from 'express';
// [Route("api/users")]
// [HttpGet]
exports.getAllUsers = ((_request, _response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const usersRef = firebase_1.db.collection('users');
        const users = [];
        const snapshot = yield usersRef.get();
        snapshot.forEach((doc) => {
            const user = doc.data();
            user.email = doc.id; // userID
            users.push(user);
        });
        _response.send(users);
    }
    catch (error) {
        _response.status(500).send(error);
    }
}));
// [HttpGet("{userId}")]
exports.getUserById = ((_request, _response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userRef = firebase_1.db.collection('users').doc(_request.params.userId);
        const snapshot = yield userRef.get();
        _response.send(snapshot.data());
    }
    catch (error) {
        _response.status(500).send(error);
    }
}));
// [HttpPost]
exports.setUser = ((_request, _response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield firebase_1.db.collection('users').doc(_request.body.email).set({ name: _request.body.name, flightID: _request.body.flightID });
        (result) ? _response.send("The user has been sucessfully added.") : _response.send(undefined);
        sendMailBuyNewCard(_request.body.email, _request.body.name, _request.body.flightID);
    }
    catch (error) {
        _response.status(500).send(error);
    }
}));
// [HttpDelete("{userId}")]
exports.deleteUserById = ((_request, _response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userRef = firebase_1.db.collection('users').doc(_request.params.userId);
        const result = yield userRef.delete();
        (result) ? _response.status(200).send("The user has been successfully deleted.") : _response.status(400).send("BAD REQUEST");
    }
    catch (error) {
        _response.status(500).send(error);
    }
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
                <center><img src="https://linkpicture.com/q/logo_69.png" alt="/" width="600" height="152"></center>
                </body>`
    };
    return transporter.sendMail(mailOptions, (erro, info) => {
        if (erro) {
            console.log(erro.toString());
        }
        console.log('Sended');
    });
}
exports.probaMail = ((request, response) => __awaiter(void 0, void 0, void 0, function* () {
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
        return transporter.sendMail(mailOptions, (erro, info) => {
            if (erro) {
                return response.send(erro.toString());
            }
            return response.send('Sended');
        });
    });
}));
//# sourceMappingURL=user.controller.js.map