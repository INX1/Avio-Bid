import * as express from 'express';
import * as BiddingController from '../controllers/bidding.controller';
export const router = express.Router();

router.get("/:roomID", BiddingController.getBids);
router.post("/", BiddingController.setBid);

module.exports = router;