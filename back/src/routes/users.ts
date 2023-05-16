import * as express from 'express';
import * as UserController from '../controllers/user.controller';
export const router = express.Router();

router.get("/", UserController.getAllUsers);
router.post("/", UserController.setUser);
router.post("/sendMail/sendMail", UserController.probaMail);
router.get("/:userId", UserController.getUserById);
//router.delete("/:userId", UserController.deleteUserById);
       


module.exports = router;