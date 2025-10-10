import { DataSource } from "typeorm";
import { Product } from "./entities/product";
import { ProductCategory } from "./entities/productCategory";
import {BarTablesEntity} from "./entities/table";
import { DailyTotal } from "./entities/dairly_total";
import { OrderItem } from "./entities/orderItems";
import { Order } from "./entities/order";
import { Payments } from "./entities/payment";
import { PaymentAllocation } from "./entities/paymentAllocation";

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'kardiogym123',
    database: 'pos2',
    synchronize: false, //Crea automaticamente las tablas al iniciar la conexión
    logging: false,
    entities: [Product, ProductCategory,BarTablesEntity,DailyTotal, OrderItem, Order, Payments, PaymentAllocation],
    subscribers: [],
    migrations: []
});