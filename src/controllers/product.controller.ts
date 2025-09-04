import { Request, Response } from "express";

const ProductController = {
    
getProducts : (req: Request,res: Response) => {
    try {
        
        return res.send('Hola')

    } catch (error) {
        
    }    
},


};

export default ProductController;
