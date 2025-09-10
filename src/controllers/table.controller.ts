import { Request, Response } from "express"
import { TablesEntity } from "../entities/table";
import { AppDataSource } from "../data-source";

const TableRepository = AppDataSource.getRepository(TablesEntity);

const TableController = {
    getTables: async (req: Request,res: Response) => {
        try {
            const tables = await TableRepository.find({});
            
            return res.status(200).json(tables);

        } catch (error) {
            return res.status(500).json({
                message: 'Error getting tables'
            })
        }
    }
};