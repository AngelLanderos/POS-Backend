import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Order } from "./order";
import { Product } from "./product";

@Entity({name: 'order_items'})
export class OrderItem extends BaseEntity{
    @PrimaryGeneratedColumn({name: 'order_item_id'})
    order_item_id: number

    @Column({name: 'quantity'})
    quantity: number

    @Column({name: 'unit_price'})
    unit_price: number

    @Column({name: 'discount'})
    discount: number

    @Column({name: 'paid_quantity'})
    paid_quantity: number
    
    @Column({name: 'paid_amount'})
    paid_amount: number

    @Column({name: 'notes'})
    notes: string

    @Column({name: 'is_paid'})
    is_paid: boolean

    @CreateDateColumn()
    created_at: Date

    @ManyToOne(() => Order)
    @JoinColumn({name: 'order_id'})
    order_id: number

    @ManyToOne(() => Product)
    @JoinColumn({ name: 'product_id' })
    product: number;
}