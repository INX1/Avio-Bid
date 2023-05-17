import { Component, OnInit } from '@angular/core';
import { FlightService } from 'src/app/services/flight.service';
import { ActivatedRoute } from '@angular/router';

import { AuctionService } from 'src/app/services/auction.service';
import { UserService } from 'src/app/services/user.service';
import { RoomModel } from 'src/app/models/room.model';
import { BidModel } from 'src/app/models/bid.model';
import { Flight } from 'src/app/models/flight.model';

@Component({
  selector: 'app-room',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.scss'],
})
export class RoomsComponent implements OnInit {
  show_Room: boolean = false;
  showSpinner: boolean = false;

  public rooms: RoomModel[] = [];
  activeRooms: number = 0;
  leaveAuction: boolean = false;

  public bids: BidModel[] = [];
  public email: string;
  public flight: Flight;

  constructor(
    private _userService: UserService,
    private _auctionService: AuctionService,
    private _flightService: FlightService,
    public route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((parms) => {
      this.email = parms['userID'];
      this._auctionService.getAuctions(parms['flightID']).subscribe((res) => {
        res.forEach((el) => {
          this.rooms.push(el);
          this.activeRooms++;
        });

        this._auctionService.rooms = this.rooms;
      });

      this._flightService.getOneFlight(parms['flightID']).subscribe((res) => {
        this._flightService.addFlight(res);
      });

      this.flight = this._flightService.flight;
    });

    this.leaveAuction = this._auctionService.leaveAuction;
  }

  onShowRoom(roomIndex: number) {
    this._auctionService
      .getBid(this.rooms[roomIndex].roomID)
      .subscribe((res) => {
        res.forEach((el) => {
          this.bids.push(el);
        });
      });

    this._auctionService.bids = this.bids;
    this._userService.emailUser = this.email;

    document.getElementById('goto').scrollIntoView({ behavior: 'smooth' });
    this._auctionService.index = roomIndex;
    this.showSpinner = true;
    this._auctionService.leaveAuction = false;

    setInterval(() => {
      this.show_Room = true;
      this.showSpinner = false;
    }, 1000);
  }
}
