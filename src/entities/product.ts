import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from "typeorm";
import { ProductCategory } from "./productCategory";

@Entity({name: 'product'})
export class Product {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    name: string;
    @Column()
    base_price: number;
    @Column()
    description: string;
    @Column({default: true})
    is_active: boolean;
    @Column()
    @OneToOne(() => ProductCategory, (category) => category.id)
     category_id: string
};

