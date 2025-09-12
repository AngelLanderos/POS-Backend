import { Request, Response } from "express"
import {  BarTablesEntity } from "../entities/table";
import { AppDataSource } from "../data-source";

const TableRepository = AppDataSource.getRepository(BarTablesEntity);

const TableController = {
    getTables: async (req: Request,res: Response) => {
        try {
            console.log(1);
            const tables = await TableRepository.find({
              order: {
                table_number: "ASC",
              },
            });
            
            return res.status(200).json(tables);

        } catch (error) {
            console.log(error);
            return res.status(500).json({
                message: 'Error getting tables',
                error
            })
        }
    }
};

export default TableController;