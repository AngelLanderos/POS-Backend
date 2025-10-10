import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToOne, JoinColumn, ManyToOne, BaseEntity } from "typeorm";
import {Payments} from './payment'
import { OrderItem } from "./orderItems";

@Entity({name: 'payment_allocation'})
export class PaymentAllocation extends BaseEntity {
    @PrimaryGeneratedColumn()
    payments_allocation_id: number;

    @Column({name: 'amount'})
    amount: number;

    @Column({name: 'quantity'})
    quantity: number;

    @CreateDateColumn()
    created_at: Date   

     @Column({ name: 'order_item_id', type: 'integer' })
  order_item_id: number;

  // relación ManyToOne hacia OrderItem
  @ManyToOne(() => OrderItem)
  @JoinColumn({ name: 'order_item_id' })
  orderItem: OrderItem;

    @OneToOne(() => Payments )
    @JoinColumn({name: 'payment_id'})
    payment_id: number 
};