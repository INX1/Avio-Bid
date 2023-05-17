import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { BidModel } from '../models/bid.model';
import { RoomModel } from '../models/room.model';

@Injectable({
  providedIn: 'root',
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
      time: '12 apr 2020 6:00 pm',
    },
    {
      room: 2,
      price: 1200,
      bids: 4,
      time: '08 apr 2020 5:00 pm',
    },
    {
      room: 3,
      price: 1500,
      bids: 8,
      time: '20 apr 2020 4:00 pm',
    },
    {
      room: 4,
      price: 1150,
      bids: 2,
      time: '14 apr 2020 6:30 pm',
    },
  ];

  constructor(private http: HttpClient) {}

  public getAuctions(flightID: string): Observable<any> {
    console.log('getAuctions: ');
    return this.http.get(`http://localhost:8080/api/auctions/${flightID}`);
  }

  public setAuctions(flightID: string, data: any): Observable<any> {
    console.log('setAuctions: ');
    return this.http.post(
      `http://localhost:8080/api/auctions/${flightID}`,
      data
    );
  }

  public deleteAuction(flightID: string): Observable<any> {
    return this.http.get(
      `http://localhost:8080/api/auctions/closeAuction/${flightID}`,
      {
        responseType: 'text',
      }
    );
  }

  public startAuction(flightID: string, data: any): Observable<any> {
    //setAuctions
    console.log('startAuction: ');
    return this.http.post(
      `http://localhost:8080/api/auctions/${flightID}`,
      data,
      {
        responseType: 'text',
      }
    );
  }

  public setBid(data: any) {
    return this.http.post('http://localhost:8080/api/bidding/', data, {
      responseType: 'text',
    });
  }

  public getBid(roomID: string): Observable<any> {
    return this.http.get(`http://localhost:8080/api/bidding/${roomID}`);
  }
}
