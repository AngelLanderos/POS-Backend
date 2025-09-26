import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'daily_total'})
export class DailyTotal {
    @PrimaryGeneratedColumn({name: 'id'})
    id: number;

    @Column({ nullable: false })
    total: number;
};