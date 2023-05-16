export interface Flight{
     origin: string;
     destination: string;
     flightID: string;
     travelDate: TravelDate;
     auctionStarted: boolean;
}

export interface TravelDate {
    _seconds: number, 
    _nanoseconds: number
}