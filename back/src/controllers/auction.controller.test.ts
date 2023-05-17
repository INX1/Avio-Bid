import { Request, Response } from 'express';
import { getRoomsByFlight, setAuctionForFlight, sendMailBuyNewCard } from './auction.controller'; 
import { db } from '../firebase';

// Mock dependencies
jest.mock('./auction.controller', () => ({
  db: {
    collection: jest.fn().mockReturnThis(),
    doc: jest.fn().mockReturnThis(),
    update: jest.fn(),
    add: jest.fn(),
    where: jest.fn().mockReturnThis(),
    get: jest.fn(),
  },
  sendMailBuyNewCard: jest.fn(),
}));

describe('getRoomsByFlight', () => {
  let request: Partial<Request>;
  let response: Partial<Response>;

  beforeEach(() => {
    request = {
      params: {
        flightId: 'flight123', // Replace with your desired flight ID
      },
    };

    response = {
      send: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should send rooms data when rooms are found', async () => {
    const mockSnapshot = {
      forEach: jest.fn((callback: Function) => {
        callback({
          id: 'room123',
          data: jest.fn().mockReturnValue({ roomID: 'room123', otherData: 'value' }),
        });
      }),
    };

    const mockGet = jest.fn().mockResolvedValue(mockSnapshot);
    //db.collection().doc().collection().get = mockGet;

    await getRoomsByFlight(request as Request, response as Response);

    expect(db.collection).toHaveBeenCalledWith('auctions');
    expect(db.doc).toHaveBeenCalledWith('flight123');
    expect(db.collection).toHaveBeenCalledWith('rooms');
    expect(mockGet).toHaveBeenCalled();
    expect(mockSnapshot.forEach).toHaveBeenCalled();
    expect(response.send).toHaveBeenCalledWith([{ roomID: 'room123', otherData: 'value' }]);
  });

  test('should send 500 status and error when an error occurs', async () => {
    const mockError = new Error('Some error message');
    const mockGet = jest.fn().mockRejectedValue(mockError);
    //db.collection().doc().collection().get = mockGet;

    await getRoomsByFlight(request as Request, response as Response);

    expect(db.collection).toHaveBeenCalledWith('auctions');
    expect(db.doc).toHaveBeenCalledWith('flight123');
    expect(db.collection).toHaveBeenCalledWith('rooms');
    expect(mockGet).toHaveBeenCalled();
    expect(response.status).toHaveBeenCalledWith(500);
    expect(response.send).toHaveBeenCalledWith(mockError);
  });
});

describe('setAuctionForFlight', () => {
  let request: Partial<Request>;
  let response: Partial<Response>;

  beforeEach(() => {
    request = {
      params: {
        flightId: 'flight123',
      },
      body: {
        number: 5,
        minCost: 100,
        time: 60,
      },
    };

    response = {
      send: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should set auctions and update flight when successful', async () => {
    const mockAuctionsRef = {
      collection: jest.fn().mockReturnThis(),
      add: jest.fn().mockResolvedValue(true),
    };
    const mockFlightsRef = {
      doc: jest.fn().mockReturnThis(),
      update: jest.fn().mockResolvedValue(true),
    };
    const mockUsersRef = {
      where: jest.fn().mockReturnThis(),
      get: jest.fn().mockResolvedValue({
        forEach: jest.fn((callback: Function) => {
          callback({ id: 'user123', data: jest.fn().mockReturnValue({ name: 'User', flightID: 'flight123' }) });
        }),
      }),
    };

    //db.collection().doc().collection = jest.fn().mockReturnValue(mockAuctionsRef);
    //db.collection().doc().update = jest.fn().mockReturnValue(mockFlightsRef);
    //db.collection().where = jest.fn().mockReturnValue(mockUsersRef);

    //await setAuctionForFlight(request as Request, response as Response);

    expect(db.collection).toHaveBeenCalledWith('auctions');
    expect(db.doc).toHaveBeenCalledWith('flight123');
    expect(mockAuctionsRef.collection).toHaveBeenCalledWith('rooms');
    expect(mockAuctionsRef.add).toHaveBeenCalledTimes(5);
    expect(mockFlightsRef.doc).toHaveBeenCalledWith('flight123');
    expect(mockFlightsRef.update).toHaveBeenCalledWith({ auctionStarted: true });
    expect(db.collection).toHaveBeenCalledWith('users');
    expect(mockUsersRef.where).toHaveBeenCalledWith('flightID', '==', 'flight123');
    expect(mockUsersRef.get).toHaveBeenCalled();
    expect(sendMailBuyNewCard).toHaveBeenCalledWith('user123', 'User', 'flight123');
    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.send).toHaveBeenCalledWith('Active: true');
  });

  test('should send 400 status when result2 is falsy', async () => {
    const mockFlightsRef = {
      doc: jest.fn().mockReturnThis(),
      update: jest.fn().mockResolvedValue(false),
    };

    //db.collection().doc().update = jest.fn().mockReturnValue(mockFlightsRef);

    //await setAuctionForFlight(request as Request, response as Response);

    expect(db.collection).toHaveBeenCalledWith('auctions');
    expect(db.doc).toHaveBeenCalledWith('flight123');
    expect(mockFlightsRef.doc).toHaveBeenCalledWith('flight123');
    expect(mockFlightsRef.update).toHaveBeenCalledWith({ auctionStarted: true });
    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.send).toHaveBeenCalledWith('BAD REQUEST');
  });

  test('should send 500 status and error when an error occurs', async () => {
    const mockError = new Error('Some error message');
    const mockFlightsRef = {
      doc: jest.fn().mockReturnThis(),
      update: jest.fn().mockRejectedValue(mockError),
    };

    //db.collection().doc().update = jest.fn().mockReturnValue(mockFlightsRef);

    //await setAuctionForFlight(request as Request, response as Response);

    expect(db.collection).toHaveBeenCalledWith('auctions');
    expect(db.doc).toHaveBeenCalledWith('flight123');
    expect(mockFlightsRef.doc).toHaveBeenCalledWith('flight123');
    expect(mockFlightsRef.update).toHaveBeenCalledWith({ auctionStarted: true });
    expect(response.status).toHaveBeenCalledWith(500);
    expect(response.send).toHaveBeenCalledWith(mockError);
  });
});

