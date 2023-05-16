import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { BidModel } from '../models/bid.model';
import { RoomModel } from '../models/room.model';

@Injectable({
  providedIn: 'root'
})
export class AuctionService {

    bids: BidModel[] = [];
    minBid: number;
    currentMaxBid: number = 0;
    leaveAuction: boolean = false;
    index: number;
    won: boolean = false;

    rooms: RoomModel[] = [];
    initializedRooms = [
        {
          room: 1,
          price: 1000,
          bids: 3,
          time: '12 apr 2020 6:00 pm'
        },
        {
          room: 2,
          price: 1200,
          bids: 4,
          time: '08 apr 2020 5:00 pm'
        },
        {
          room: 3,
          price: 1500,
          bids: 8,
          time: '20 apr 2020 4:00 pm'
        },
        {
          room: 4,
          price: 1150,
          bids: 2,
          time: '14 apr 2020 6:30 pm'
        },
      ];

  constructor(private http: HttpClient) { }

  public getAuctions(flightID: string): Observable<any>{
    return this.http.get(`https://us-central1-aukcija-edit-2020.cloudfunctions.net/app/api/auctions/${flightID}`);
  }

  public setAuctions(flightID: string, data: any): Observable<any>{
    return this.http.post(`https://us-central1-aukcija-edit-2020.cloudfunctions.net/app/api/auctions/${flightID}`, data);
  }

  public deleteAuction(flightID: string): Observable<any>{
    return this.http.get(`https://us-central1-aukcija-edit-2020.cloudfunctions.net/app/api/auctions/closeAuction/${flightID}`);
  }

  public startAuction(flightID: string, data: any): Observable<any>{ //setAuctions
    return this.http.post(`https://us-central1-aukcija-edit-2020.cloudfunctions.net/app/api/auctions/${flightID}`, data);
  }

  public setBid(data: any){
    return this.http.post('https://us-central1-aukcija-edit-2020.cloudfunctions.net/app/api/bidding/', data);
  }

  public getBid(roomID: string): Observable<any>{
    return this.http.get(`https://us-central1-aukcija-edit-2020.cloudfunctions.net/app/api/bidding/${roomID}`);
  }
}
