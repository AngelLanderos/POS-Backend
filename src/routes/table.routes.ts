import { Router } from "express";
import { TableExclusion } from "typeorm";
import TableController from "../controllers/table.controller";

const TableRouter = Router();

TableRouter.get('/getTables',TableController.getTables);

export default TableRouter;