import { Entity, Column , PrimaryGeneratedColumn, OneToMany} from "typeorm";

@Entity ({name: 'bar_table'})
export class BarTablesEntity {
    @PrimaryGeneratedColumn({name: 'table_id'})
    id: number

    @Column({name: 'table_number'})
    table_number: number

    @Column({name: 'status'})
    status: string

    @Column({default: 0})
    provisionalTotal: number

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date

    
};