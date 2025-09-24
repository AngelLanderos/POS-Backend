import { Entity, Column , PrimaryGeneratedColumn} from "typeorm";

@Entity ({name: 'bar_table'})
export class BarTablesEntity {
    @PrimaryGeneratedColumn({name: 'table_id'})
    id: number

    @Column()
    table_number: number

    @Column()
    status: string

    @Column({default: 0})
    provisionalTotal: number

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date
};