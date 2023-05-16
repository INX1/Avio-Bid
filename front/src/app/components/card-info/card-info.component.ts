import { Component, OnInit } from '@angular/core';
import { FlightService } from 'src/app/services/flight.service';
import { Flight } from '../../models/flight.model';

@Component({
  selector: 'app-card-info',
  templateUrl: './card-info.component.html',
  styleUrls: ['./card-info.component.scss']
})
export class CardInfoComponent implements OnInit {

  // Information
  fromPlace: string = 'New York';
  toPlace: string = 'Dublin';
  time: string = 'Tue, 15 Dec 2020';
  
  // Time
  vremePolaska: string = '17:30'
  vremeDolaska: string = '04:45'

  flight: Flight;
  constructor( private _flightService: FlightService) {}

  ngOnInit() {
    this.flight = this._flightService.flight;
  }
}
