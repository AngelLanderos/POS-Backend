import { Router } from "express";
import productCategoryController from "../controllers/productCategory.controller";

const productCategoryRouter = Router();

productCategoryRouter.get('/getProductCategories',productCategoryController.getProductsCategory);

export default productCategoryRouter;