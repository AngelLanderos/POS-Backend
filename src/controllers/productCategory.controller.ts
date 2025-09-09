import { Request, Response } from "express";
import { ProductCategory } from "../entities/productCategory";
import { AppDataSource } from "../data-source";

const productCategoryRepository = AppDataSource.getRepository(ProductCategory);


const productCategoryController = { 
    getProductsCategory : async (req: Request,res: Response) => {
        try {

            const productsCategory = await productCategoryRepository.find();

            return res.status(200).json(productsCategory);

        } catch (error) {
            
        }    
    }
};

export default productCategoryController;
