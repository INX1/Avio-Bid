import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { Flight, TravelDate } from 'src/app/models/flight.model';
import { AdminHeroPageComponent } from './admin-hero-page.component';
import { FlightService } from 'src/app/services/flight.service';
import { AuctionService } from 'src/app/services/auction.service';
import { AdminPopUpComponent } from '../admin-pop-up/admin-pop-up.component';

describe('AdminHeroPageComponent', () => {
  let component: AdminHeroPageComponent;
  let fixture: ComponentFixture<AdminHeroPageComponent>;
  let mockFlightService: jasmine.SpyObj<FlightService>;
  let mockAuctionService: jasmine.SpyObj<AuctionService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockMatDialog: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    const mockFlightServiceSpy = jasmine.createSpyObj('FlightService', [
      'getFlights',
    ]);
    const mockAuctionServiceSpy = jasmine.createSpyObj('AuctionService', [
      'deleteAuction',
    ]);
    const mockRouterSpy = jasmine.createSpyObj('Router', ['navigate']);
    const mockMatDialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      declarations: [AdminHeroPageComponent],
      providers: [
        { provide: FlightService, useValue: mockFlightServiceSpy },
        { provide: AuctionService, useValue: mockAuctionServiceSpy },
        { provide: Router, useValue: mockRouterSpy },
        { provide: MatDialog, useValue: mockMatDialogSpy },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminHeroPageComponent);
    component = fixture.componentInstance;
    mockFlightService = TestBed.inject(
      FlightService
    ) as jasmine.SpyObj<FlightService>;
    mockAuctionService = TestBed.inject(
      AuctionService
    ) as jasmine.SpyObj<AuctionService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    mockMatDialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should fetch flights from FlightService', () => {
      const mockFlights: Flight[] = [
        {
          origin: 'Origin 1',
          destination: 'Destination 1',
          flightID: '1',
          travelDate: { _seconds: 1683626441, _nanoseconds: 0 },
          auctionStarted: false,
        },
        {
          origin: 'Origin 2',
          destination: 'Destination 2',
          flightID: '2',
          travelDate: { _seconds: 1683626442, _nanoseconds: 0 },
          auctionStarted: true,
        },
      ];
      mockFlightService.getFlights.and.returnValue(of(mockFlights));

      component.ngOnInit();

      expect(mockFlightService.getFlights).toHaveBeenCalled();
      expect(component.flights).toEqual(mockFlights);
    });

    it('should set hhmmFormat and hhmmFormat2 values correctly', () => {
      // Mock date values
      const mockDate1: TravelDate = { _seconds: 1683626441, _nanoseconds: 0 };
      const mockDate2: TravelDate = {
        _seconds: 1683626441 + 7200,
        _nanoseconds: 0,
      };

      const toLocaleStringSpy = spyOn(
        Date.prototype,
        'toLocaleString'
      ).and.callThrough();

      component.ngOnInit();

      expect(toLocaleStringSpy).toHaveBeenCalledTimes(2);
      expect(toLocaleStringSpy.calls.argsFor(0)).toEqual([
        'en-US',
        { hour: 'numeric', hour12: true },
      ]);
      expect(toLocaleStringSpy.calls.argsFor(1)).toEqual([
        'en-US',
        { hour: 'numeric', hour12: true },
      ]);

      expect(component.hhmmFormat).toEqual(
        new Date(mockDate1._seconds * 1000).toLocaleString('en-US', {
          hour: 'numeric',
          hour12: true,
        })
      );
      expect(component.hhmmFormat2).toEqual(
        new Date(mockDate2._seconds * 1000).toLocaleString('en-US', {
          hour: 'numeric',
          hour12: true,
        })
      );
    });
  });

  describe('onStartAuction', () => {
    it('should open the AdminPopUpComponent dialog', () => {
      const mockFlightID = 'testFlightID';
      const mockIndex = 0;
      const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', [
        'afterClosed',
      ]);
      mockMatDialog.open.and.returnValue(dialogRefSpy);

      component.onStartAuction(mockFlightID, mockIndex);

      expect(mockMatDialog.open).toHaveBeenCalledWith(AdminPopUpComponent, {
        data: { flightID: mockFlightID },
        width: '350px',
      });
    });

    it('should update auctionStarted property in the flights array after dialog is closed', () => {
      const mockFlightID = 'testFlightID';
      const mockIndex = 0;
      const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', [
        'afterClosed',
      ]);
      dialogRefSpy.afterClosed.and.returnValue(of({}));
      mockMatDialog.open.and.returnValue(dialogRefSpy);

      component.flights = [
        {
          origin: 'Origin 1',
          destination: 'Destination 1',
          flightID: mockFlightID,
          travelDate: { _seconds: 1683626441, _nanoseconds: 0 },
          auctionStarted: false,
        },
      ];

      component.onStartAuction(mockFlightID, mockIndex);

      expect(dialogRefSpy.afterClosed).toHaveBeenCalled();
      expect(component.flights[mockIndex].auctionStarted).toBe(true);
    });
  });

  describe('onViewAuction', () => {
    it('should navigate to the correct route', () => {
      const mockFlightID = 'testFlightID';

      component.onViewAuction(mockFlightID);

      expect(mockRouter.navigate).toHaveBeenCalledWith([
        '/Admin',
        mockFlightID,
      ]);
    });
  });

  describe('onStopAuction', () => {
    it('should delete the auction and update auctionStarted property in the flights array', () => {
      const mockFlightID = 'testFlightID';
      const mockIndex = 0;
      mockAuctionService.deleteAuction.and.returnValue(of({}));
      component.flights = [
        {
          origin: 'Origin 1',
          destination: 'Destination 1',
          flightID: mockFlightID,
          travelDate: { _seconds: 1683626441, _nanoseconds: 0 },
          auctionStarted: true,
        },
      ];

      component.onStopAuction(mockFlightID, mockIndex);

      expect(mockAuctionService.deleteAuction).toHaveBeenCalledWith(
        mockFlightID
      );
      expect(component.flights[mockIndex].auctionStarted).toBe(false);
    });
  });
});
