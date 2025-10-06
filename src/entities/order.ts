import { Entity, Column, PrimaryGeneratedColumn, OneToOne, CreateDateColumn, BaseEntity, ManyToOne, JoinColumn } from "typeorm";
import { BarTablesEntity } from "./table";

@Entity({name:'orders'})
export class Order extends BaseEntity {
    @PrimaryGeneratedColumn({ name: "order_id" })
    order_id: number

    @Column({ name: 'status', length: 50 })
    status: string

    @Column({ name: 'created_at' })
    created_at: Date

    @Column({ name: 'closed_at', type: 'timestamp', nullable: true })
    closed_at: Date

    @ManyToOne(() => BarTablesEntity)
    @JoinColumn({name: 'table_id'})
    table_id: BarTablesEntity
}