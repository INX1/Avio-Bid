import { Injectable } from '@angular/core';
import { Flight } from '../models/flight.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FlightService {

  public flight: Flight;

  constructor(private http: HttpClient) { }


  public addFlight(flight: Flight){
    this.flight = flight;
  }

  public getRandomFlight(): Observable<any>{
    return this.http.get('http://localhost:8080/api/flights/getRandomFlight');
  }
  /* Za Admin deo */
  public getFlights(): Observable<any>{
    return this.http.get('http://localhost:8080/api/flights');
  }

  public getOneFlight(flightID: string): Observable<any>{
    return this.http.get(`http://localhost:8080/api/flights/${flightID}`);
  }
}
