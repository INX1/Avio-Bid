import { Request, Response } from "express";
import { setUser } from "./user.controller";
import { db } from "../firebase";

// Mock dependencies
jest.mock("./user.controller", () => ({
  db: {
    collection: jest.fn().mockReturnThis(),
    doc: jest.fn().mockReturnThis(),
    set: jest.fn(),
  },
}));

describe("setUser", () => {
  let request: Partial<Request>;
  let response: Partial<Response>;

  beforeEach(() => {
    request = {
      body: {
        email: "test@example.com",
        name: "John Doe",
        flightID: "flight123",
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

  test("should send success message when user is successfully added", async () => {
    const mockSet = jest.fn();
    db.collection().doc().set = mockSet;

    await setUser(request as Request, response as Response);

    expect(db.collection).toHaveBeenCalledWith("users");
    expect(db.doc).toHaveBeenCalledWith("test@example.com");
    expect(mockSet).toHaveBeenCalledWith({
      name: "John Doe",
      flightID: "flight123",
    });
    expect(response.send).toHaveBeenCalledWith(
      "The user has been successfully added."
    );
  });

  test("should send undefined when user addition fails", async () => {
    const mockSet = jest
      .fn()
      .mockRejectedValue(new Error("Failed to add user"));
    db.collection().doc().set = mockSet;

    await setUser(request as Request, response as Response);

    expect(db.collection).toHaveBeenCalledWith("users");
    expect(db.doc).toHaveBeenCalledWith("test@example.com");
    expect(mockSet).toHaveBeenCalledWith({
      name: "John Doe",
      flightID: "flight123",
    });
    expect(response.send).toHaveBeenCalledWith(undefined);
  });

  test("should send 500 status and error when an error occurs", async () => {
    const mockError = new Error("Some error message");
    const mockSet = jest.fn().mockRejectedValue(mockError);
    db.collection().doc().set = mockSet;

    await setUser(request as Request, response as Response);

    expect(db.collection).toHaveBeenCalledWith("users");
    expect(db.doc).toHaveBeenCalledWith("test@example.com");
    expect(mockSet).toHaveBeenCalledWith({
      name: "John Doe",
      flightID: "flight123",
    });
    expect(response.status).toHaveBeenCalledWith(500);
    expect(response.send).toHaveBeenCalledWith(mockError);
  });
});
