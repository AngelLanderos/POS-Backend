import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'product_category'})
export class ProductCategory {
    @PrimaryGeneratedColumn()
    id: number
    @Column()
    name: string;
    @Column()
    description: string;
};