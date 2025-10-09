import { Router } from "express";
import OrderController from "../controllers/order.controller";

const OrderRouter = Router();

OrderRouter.post('/createNewOrder',OrderController.createNewOrder);

OrderRouter.post('/getOrders',OrderController.getOrders)

OrderRouter.post('/provitionalPayment',OrderController.provitionalPayment);

export default OrderRouter;