import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FlightService } from 'src/app/services/flight.service';
import { ActivatedRoute } from '@angular/router';
import { AuctionService } from 'src/app/services/auction.service';
import { UserService } from 'src/app/services/user.service';
import { Flight } from 'src/app/models/flight.model';

@Component({
  selector: 'app-rooms',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss'],
})
export class RoomComponent implements OnInit {
  listPackage: string[] = [
    'A seat that seamlessly reclines into a fully flat bed',
    'Menu of regionally inspired gourmet dishes',
    'Excellent service',
  ];
  public flight: Flight;

  bids: number = 0;
  bidingForm: FormGroup;
  bidingPrice: number = 1000;
  bidPlaceholder: number = 1000;
  initializedRooms: {
    room: number;
    price: number;
    bids: number;
    time: string;
  }[] = [];
  index: number;
  nameUser: string = '';

  constructor(
    private _userService: UserService,
    private _auctionService: AuctionService,
    private _flightService: FlightService,
    public router: ActivatedRoute
  ) {
    this.flight = _flightService.flight;
  }

  ngOnInit() {
    this.bidingForm = new FormGroup({
      bidingPrice: new FormControl(null, Validators.required),
    });

    this.router.params.subscribe((parms) => {
      this._auctionService.getAuctions(parms['flightID']).subscribe((res) => {
        this.bids = res[0].currentBid;
        console.log(res[0].currentBid);
      });
    });

    this.initializedRooms = this._auctionService.initializedRooms;
    this.index = this._auctionService.index;
    this.nameUser = this._userService.nameUser;

    setInterval(() => {
      this._auctionService
        .getBid(this._auctionService.rooms[this._auctionService.index].roomID)
        .subscribe((res) => {
          this.bids = res[0].bid;
        });
    }, 1000);
  }

  /* Submit za bid fromu */
  onBidSubmit() {
    this.bidingForm.get('bidingPrice').value <= this.bidingPrice
      ? alert(
          'Error! You have entered a price below the current bid or the same as the current bid'
        )
      : (this.bidingPrice = parseInt(this.bidingForm.get('bidingPrice').value));

    /* Slanje manuel bida */
    this.router.params.subscribe((parms) => {
      this._auctionService
        .setBid({
          flightID: parms['flightID'],
          roomID: this._auctionService.rooms[this._auctionService.index].roomID,
          email: this._userService.emailUser,
          bid: this.bidingPrice,
        })
        .subscribe((res) => {});
    });

    this.bidPlaceholder = this.bidingPrice;
  }

  onLeaveAuction() {
    this._auctionService.leaveAuction = true;
    window.location.reload();
  }
}
