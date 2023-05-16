import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { FlightService } from 'src/app/services/flight.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-auction-confirm',
  templateUrl: './auction-confirm.component.html',
  styleUrls: ['./auction-confirm.component.scss']
})
export class AuctionConfirmComponent implements OnInit {
  constructor(public route: Router, private _flightService: FlightService, private _userService: UserService) { }

  ngOnInit() {}

  onYes(){
    this.route.navigate([`auctions/${this._flightService.flight.flightID}/${this._userService.emailUser}`]);
  }
}
