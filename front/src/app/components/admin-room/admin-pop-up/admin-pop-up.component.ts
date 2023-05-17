import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { AuctionService } from 'src/app/services/auction.service';

@Component({
  selector: 'app-admin-pop-up',
  templateUrl: './admin-pop-up.component.html',
  styleUrls: ['./admin-pop-up.component.scss'],
})
export class AdminPopUpComponent implements OnInit {
  bidingForm: FormGroup;
  constructor(
    public route: ActivatedRoute,
    private _auctionService: AuctionService,
    public router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AdminPopUpComponent>
  ) {}

  ngOnInit(): void {
    this.bidingForm = new FormGroup({
      bidingPrice: new FormControl(null, Validators.required),
    });
  }
  onBidSubmit() {
    this._auctionService.minBid = this.bidingForm.get('bidingPrice').value;

    this._auctionService
      .startAuction(this.data['flightID'], {
        minCost: this._auctionService.minBid,
        number: 2,
        time: { _seconds: 23123123, _nanoseconds: 0 },
      })
      .subscribe(() => {});

    this.dialogRef.close();
    this.router.navigate(['/Admin']);
  }
}
