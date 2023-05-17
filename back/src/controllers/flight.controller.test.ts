import { Request, Response } from 'express';
import { getFlightById } from './flight.controller';
import { db } from '../firebase';

// Mock dependencies
jest.mock('./flight.controller', () => ({
  db: {
    collection: jest.fn().mockReturnThis(),
    doc: jest.fn().mockReturnThis(),
    get: jest.fn(),
  },
}));

describe('getFlightById', () => {
  let request: Partial<Request>;
  let response: Partial<Response>;

  beforeEach(() => {
    request = {
      params: {
        flightId: 'flight123',
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

  test('should send flight data when flight is found', async () => {
    const mockData = { flightID: 'flight123', origin: 'Origin', destination: 'Destination' };
    const mockGet = jest.fn().mockResolvedValue({ data: () => mockData });
    db.collection().doc().get = mockGet;

    await getFlightById(request as Request, response as Response);

    expect(db.collection).toHaveBeenCalledWith('flights');
    expect(db.doc).toHaveBeenCalledWith('flight123');
    expect(mockGet).toHaveBeenCalled();
    expect(response.send).toHaveBeenCalledWith(mockData);
  });

  test('should send 500 status and error when an error occurs', async () => {
    const mockError = new Error('Some error message');
    const mockGet = jest.fn().mockRejectedValue(mockError);
    db.collection().doc().get = mockGet;

    await getFlightById(request as Request, response as Response);

    expect(db.collection).toHaveBeenCalledWith('flights');
    expect(db.doc).toHaveBeenCalledWith('flight123');
    expect(mockGet).toHaveBeenCalled();
    expect(response.status).toHaveBeenCalledWith(500);
    expect(response.send).toHaveBeenCalledWith(mockError);
  });
});
