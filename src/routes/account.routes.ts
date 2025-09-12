import { Router } from "express";
import AccountController from "../controllers/account.controller";
import { defaultMaxListeners } from "events";

const AccountRouter = Router();

AccountRouter.post('/createProvitionalAccount',AccountController.createProvitionalAccount);
AccountRouter.post('/provitionalPayment',AccountController.provitionalPayment);

export default AccountRouter;