import * as express from 'express';
import * as FlightController from '../controllers/flight.controller';
export const router = express.Router();

router.get("/", FlightController.getAllFlights);
router.get("/getRandomFlight", FlightController.getRandomFlight);
router.get("/:flightId", FlightController.getFlightById);

module.exports = router;