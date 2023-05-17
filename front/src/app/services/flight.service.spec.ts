import { TestBed } from '@angular/core/testing';

import { FlightService } from './flight.service';
import { HttpClientModule } from '@angular/common/http';

describe('FlightsService', () => {
  let service: FlightService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [HttpClientModule] });
    service = TestBed.inject(FlightService);
  });

  it('should be created', () => {
    //expect(service).toBeTruthy();
  });
});
