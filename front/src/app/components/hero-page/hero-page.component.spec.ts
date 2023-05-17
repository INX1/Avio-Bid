import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { HeroPageComponent } from './hero-page.component';
import { FlightService } from '../../services/flight.service';
import { UserService } from 'src/app/services/user.service';
import { of } from 'rxjs';
import { Flight } from 'src/app/models/flight.model';

describe('HeroPageComponent', () => {
  let component: HeroPageComponent;
  let fixture: ComponentFixture<HeroPageComponent>;
  let mockFlightService: jasmine.SpyObj<FlightService>;
  let mockUserService: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    const mockFlightServiceSpy = jasmine.createSpyObj('FlightService', [
      'getRandomFlight',
      'addFlight',
    ]);
    const mockUserServiceSpy = jasmine.createSpyObj('UserService', [
      'setUserData',
    ]);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [HeroPageComponent],
      providers: [
        { provide: FlightService, useValue: mockFlightServiceSpy },
        { provide: UserService, useValue: mockUserServiceSpy },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeroPageComponent);
    component = fixture.componentInstance;
    mockFlightService = TestBed.inject(
      FlightService
    ) as jasmine.SpyObj<FlightService>;
    mockUserService = TestBed.inject(
      UserService
    ) as jasmine.SpyObj<UserService>;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should fetch a random flight from FlightService and add it', () => {
      const mockFlight: Flight = {
        origin: 'Origin 1',
        destination: 'Destination 1',
        flightID: '1',
        travelDate: { _seconds: 1683626441, _nanoseconds: 0 },
        auctionStarted: false,
      };
      mockFlightService.getRandomFlight.and.returnValue(of(mockFlight));

      component.ngOnInit();

      expect(mockFlightService.getRandomFlight).toHaveBeenCalled();
      expect(mockFlightService.addFlight).toHaveBeenCalledWith(mockFlight);
    });

    it('should initialize the loginForm with the correct form controls', () => {
      component.ngOnInit();

      expect(component.loginForm).toBeTruthy();
      expect(component.loginForm.get('email')).toBeTruthy();
      expect(component.loginForm.get('fullname')).toBeTruthy();
    });
  });

  describe('onSubmit', () => {
    it('should set email and name values and call setUserData on UserService', () => {
      const mockEmail = 'test@example.com';
      const mockName = 'John Doe';
      const mockFlightID = '2';
      const mockFlight: Flight = {
        origin: 'Origin 1',
        destination: 'Destination 1',
        flightID: mockFlightID,
        travelDate: { _seconds: 1683626441, _nanoseconds: 0 },
        auctionStarted: false,
      };
      mockFlightService.flight = mockFlight;
      component.loginForm = new FormGroup({
        email: new FormControl(mockEmail, [
          Validators.required,
          Validators.email,
        ]),
        fullname: new FormControl(mockName, Validators.required),
      });
      mockUserService.setUserData.and.returnValue(of(''));

      component.onSubmit();

      expect(component.email).toEqual(mockEmail);
      expect(component.name).toEqual(mockName);
      expect(mockUserService.emailUser).toEqual(mockEmail);
      expect(mockUserService.nameUser).toEqual(mockName);
      expect(mockUserService.setUserData).toHaveBeenCalledWith({
        email: mockEmail,
        name: mockName,
        flightID: mockFlightID,
      });
      expect(component.log).toBeTrue();
    });
  });
});
