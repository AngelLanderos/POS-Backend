import { Router } from "express";
import PaymentController from "../controllers/payment.controller";

const paymentRouter = Router();

paymentRouter.post('/paySelected', PaymentController.paySelected);

export default paymentRouter;