import { Router } from "express";
import ProductController from "../controllers/product.controller";

const productRouter = Router();

productRouter.get('/getProducts',ProductController.getProducts);

export default productRouter;

