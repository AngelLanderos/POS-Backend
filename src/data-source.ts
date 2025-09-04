import { DataSource } from "typeorm";
import { Product } from "./entities/product";
import { ProductCategory } from "./entities/productCategory";

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'alumno',
    password: '123456',
    database: 'corral_pos_system',
    synchronize: false, //Crea automaticamente las tablas al iniciar la conexión
    logging: false,
    entities: [Product, ProductCategory],
    subscribers: [],
    migrations: []
});