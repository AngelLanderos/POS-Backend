import { Entity, Column , PrimaryGeneratedColumn} from "typeorm";

@Entity ({name: 'tables'})
export class TablesEntity {
    @PrimaryGeneratedColumn({name: 'table_id'})
    id: number

    @Column()
    table_number: number

    @Column()
    status: string

    @Column()
    created_at: Date
};