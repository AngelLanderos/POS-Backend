import { Router } from "express";
import OrderItemController from "../controllers/orderItems.controller";


const orderItemRouter = Router();

orderItemRouter.post('/getOrderItems',OrderItemController.getOrderItems );
orderItemRouter.post('/createItemsForBarSale',OrderItemController.createItemsForBarSale );

export default orderItemRouter;