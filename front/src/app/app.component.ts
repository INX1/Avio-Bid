import { Component } from '@angular/core';
import { AuctionService } from './services/auction.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  won: boolean = false;

  constructor(private _auctionService: AuctionService){
    this.won = _auctionService.won;
  }
}
