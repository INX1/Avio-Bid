"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const auction_controller_1 = require("./auction.controller");
const firebase_1 = require("../firebase");
// Mock dependencies
jest.mock('./auction.controller', () => ({
    db: {
        collection: jest.fn().mockReturnThis(),
        doc: jest.fn().mockReturnThis(),
        get: jest.fn(),
    },
}));
describe('getRoomsByFlight', () => {
    let request;
    let response;
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
    test('should send rooms data when rooms are found', () => __awaiter(void 0, void 0, void 0, function* () {
        const mockSnapshot = {
            forEach: jest.fn((callback) => {
                callback({
                    id: 'room123',
                    data: jest.fn().mockReturnValue({ roomID: 'room123', otherData: 'value' }),
                });
            }),
        };
        const mockGet = jest.fn().mockResolvedValue(mockSnapshot);
        firebase_1.db.collection().doc().collection().get = mockGet;
        yield (0, auction_controller_1.getRoomsByFlight)(request, response);
        expect(firebase_1.db.collection).toHaveBeenCalledWith('auctions');
        expect(firebase_1.db.doc).toHaveBeenCalledWith('flight123');
        expect(firebase_1.db.collection).toHaveBeenCalledWith('rooms');
        expect(mockGet).toHaveBeenCalled();
        expect(mockSnapshot.forEach).toHaveBeenCalled();
        expect(response.send).toHaveBeenCalledWith([{ roomID: 'room123', otherData: 'value' }]);
    }));
    test('should send 500 status and error when an error occurs', () => __awaiter(void 0, void 0, void 0, function* () {
        const mockError = new Error('Some error message');
        const mockGet = jest.fn().mockRejectedValue(mockError);
        firebase_1.db.collection().doc().collection().get = mockGet;
        yield (0, auction_controller_1.getRoomsByFlight)(request, response);
        expect(firebase_1.db.collection).toHaveBeenCalledWith('auctions');
        expect(firebase_1.db.doc).toHaveBeenCalledWith('flight123');
        expect(firebase_1.db.collection).toHaveBeenCalledWith('rooms');
        expect(mockGet).toHaveBeenCalled();
        expect(response.status).toHaveBeenCalledWith(500);
        expect(response.send).toHaveBeenCalledWith(mockError);
    }));
});
//# sourceMappingURL=auction.controller.test.js.map