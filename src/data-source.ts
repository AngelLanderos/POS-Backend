import { DataSource } from "typeorm";
import { Product } from "./entities/product";
import { ProductCategory } from "./entities/productCategory";
import {BarTablesEntity} from "./entities/table";

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'kardiogym123',
    database: 'pos2',
    synchronize: false, //Crea automaticamente las tablas al iniciar la conexión
    logging: false,
    entities: [Product, ProductCategory,BarTablesEntity],
    subscribers: [],
    migrations: []
});