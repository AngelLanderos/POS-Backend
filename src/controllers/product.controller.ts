import { Request, Response } from "express";
import { Product } from "../entities/product";
import { AppDataSource } from "../data-source";

const productRepository = AppDataSource.getRepository(Product);

const ProductController = {
  getProducts: async (req: Request, res: Response) => {
    try {

      const products = await productRepository.find({
        relations: ["category"],
        where: { is_active: true }
      });

      console.log({products});
      return res.status(200).json(products);

    } catch (error) {
        return res.status(500).send('Error getting products');
    };
  },

  createProduct: async (req: Request, res: Response) => {
    try {
        const newProduct = {
            name: 'Mojito de Frutos Rojos', base_price: 120, description: 'Fresa, hierbabuena, ron',category_id:1,is_active: true
        };
        // const newProduct = req.body;
        const productToSave = productRepository.create(newProduct);

        const productSave = await productRepository.save(productToSave);

        return res.status(201).json({
            message: 'Product created succesfully',
            productSave
        });

    } catch (error) {
        return res.status(500).json({
            
        });
    }
  },
};

export default ProductController;
