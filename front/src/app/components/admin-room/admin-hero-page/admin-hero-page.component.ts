import { Component, OnInit } from '@angular/core';
import { Flight } from 'src/app/models/flight.model';
import { Router } from '@angular/router';
import { FlightService } from 'src/app/services/flight.service';
import { AuctionService } from 'src/app/services/auction.service';
import { AdminPopUpComponent } from '../admin-pop-up/admin-pop-up.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-admin-hero-page',
  templateUrl: './admin-hero-page.component.html',
  styleUrls: ['./admin-hero-page.component.scss'],
})
export class AdminHeroPageComponent implements OnInit {
  public hhmmFormat: string = '';
  public hhmmFormat2: string = '';
  flights: Flight[] = [];
  constructor(
    private _flightService: FlightService,
    private _auctionService: AuctionService,
    public route: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this._flightService.getFlights().subscribe((res) => {
      res.forEach((el) => {
        this.flights.push(el);
      });
    });

    const date = new Date(1683626441 * 1000);
    console.log(
      date.toLocaleString('en-US', { hour: 'numeric', hour12: true })
    );
    this.hhmmFormat = date.toLocaleString('en-US', {
      hour: 'numeric',
      hour12: true,
    });
    const date2 = new Date((1683626441 + 7200) * 1000);
    console.log(
      date2.toLocaleString('en-US', { hour: 'numeric', hour12: true })
    );
    this.hhmmFormat2 = date2.toLocaleString('en-US', {
      hour: 'numeric',
      hour12: true,
    });
    console.log(this.hhmmFormat);
  }

  onStartAuction(flightID: string, index: number) {
    const dialogRef = this.dialog.open(AdminPopUpComponent, {
      data: {
        flightID: flightID,
      },
      width: '350px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.flights[index].auctionStarted = !this.flights[index].auctionStarted;
    });
  }

  onViewAuction(flightID: string) {
    this.route.navigate([`/Admin/${flightID}`]);
  }

  onStopAuction(flightID: string, index: number) {
    this._auctionService.deleteAuction(flightID).subscribe(() => {});
    this.flights[index].auctionStarted = !this.flights[index].auctionStarted;
  }
}
