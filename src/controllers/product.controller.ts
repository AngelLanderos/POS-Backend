import { Request, Response } from "express";
import { Product } from "../entities/product";
import { AppDataSource } from "../data-source";

const productRepository = AppDataSource.getRepository(Product);


const ProductController = {
    
getProducts : async (req: Request,res: Response) => {
    try {

        const products = await productRepository.find();
        
        console.log(products);


        return res.status(200).json(products);

    } catch (error) {
        
    }    
},

};

export default ProductController;
