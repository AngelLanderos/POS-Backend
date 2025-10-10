import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToOne, JoinColumn, BaseEntity } from "typeorm";
import { Order } from "./order";

@Entity({name: 'payments'})
export class Payments extends BaseEntity{
    @PrimaryGeneratedColumn()
    payment_id: number;

    @Column({name: 'amount'})
    amount: number;

    @Column({name: 'method'})
    method: string;

    @CreateDateColumn()
    paid_at: Date   

    @OneToOne(() => Order )
    @JoinColumn({name: 'order_id'})
    order_id: number | null
};