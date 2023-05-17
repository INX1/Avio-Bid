import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { AdminPopUpComponent } from './admin-pop-up.component';
import { AuctionService } from 'src/app/services/auction.service';
import { AppModule } from 'src/app/app.module';
import { HttpClientModule } from '@angular/common/http';
import { APP_BASE_HREF } from '@angular/common';

describe('AdminPopUpComponent', () => {
  let component: AdminPopUpComponent;
  let fixture: ComponentFixture<AdminPopUpComponent>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<AdminPopUpComponent>>;
  let mockAuctionService: jasmine.SpyObj<AuctionService>;

  beforeEach(async () => {
    const mockAuctionServiceSpy = jasmine.createSpyObj('AuctionService', [
      'startAuction',
    ]);
    const mockDialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule, AppModule],
      declarations: [AdminPopUpComponent],
      providers: [
        HttpClientModule,
        { provide: APP_BASE_HREF, useValue: '/' },
        { provide: MatDialogRef, useValue: mockDialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: AuctionService, useValue: mockAuctionServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: { params: of({ flightID: 'testFlightID' }) },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminPopUpComponent);
    component = fixture.componentInstance;
    mockDialogRef = TestBed.inject(MatDialogRef) as jasmine.SpyObj<
      MatDialogRef<AdminPopUpComponent>
    >;
    mockAuctionService = TestBed.inject(
      AuctionService
    ) as jasmine.SpyObj<AuctionService>;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should initialize the biddingForm with null bidingPrice control', () => {
      component.ngOnInit();
      expect(component.bidingForm.get('bidingPrice')).toBeTruthy();
      expect(component.bidingForm.get('bidingPrice').value).toBeNull();
    });
  });

  describe('onBidSubmit', () => {
    beforeEach(() => {
      component.bidingForm = new FormGroup({});
    });

    it('should set minBid value in AuctionService', () => {
      const mockMinBid = 100;
      component.bidingForm?.get('bidingPrice')?.setValue(mockMinBid);

      component.onBidSubmit();

      expect(mockAuctionService.minBid).toBe(mockMinBid);
    });

    it('should call startAuction with correct parameters', () => {
      const mockMinBid = 100;
      const mockFlightID = 'testFlightID';
      const expectedAuctionParams = {
        minCost: mockMinBid,
        number: 2,
        time: { _seconds: 23123123, _nanoseconds: 0 },
      };

      component.bidingForm.get('bidingPrice')?.setValue(mockMinBid);
      component.data = { flightID: mockFlightID };

      component.onBidSubmit();

      expect(mockAuctionService.startAuction).toHaveBeenCalledWith(
        mockFlightID,
        expectedAuctionParams
      );
    });

    it('should close the dialog and navigate to "/Admin"', () => {
      component.onBidSubmit();

      expect(mockDialogRef.close).toHaveBeenCalled();
      expect(component.router.navigate).toHaveBeenCalledWith(['/Admin']);
    });
  });
});
``;
