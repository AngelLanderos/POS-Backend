import { Router } from "express";
import OrderItemController from "../controllers/orderItems.controller";


const orderItemRouter = Router();

orderItemRouter.post('/getOrderItems',OrderItemController.getOrderItems );

export default orderItemRouter;