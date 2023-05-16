import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RoomModel } from 'src/app/models/room.model';
import { AuctionService } from 'src/app/services/auction.service';

@Component({
  selector: 'app-admin-room',
  templateUrl: './admin-room.component.html',
  styleUrls: ['./admin-room.component.scss']
})
export class AdminRoomComponent implements OnInit {


  constructor(private _auctionService: AuctionService, public router: ActivatedRoute) {}
  rooms: RoomModel[] = [];

  ngOnInit(): void {

    this.router.params.subscribe((parms) => {

      this._auctionService.getAuctions(parms['flightID']).subscribe((res) => {
        res.forEach((el) => {
          this.rooms.push(el);
        })    
      })
    })
  }
  onStopAuction() {}
}
