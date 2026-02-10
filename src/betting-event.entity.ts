
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class BettingEvent {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    optionA: string;

    @Column()
    optionB: string;

    @Column({ default: 0 })
    poolA: number;

    @Column({ default: 0 })
    poolB: number;

    @Column({ default: 'OPEN' })
    status: string;

    @CreateDateColumn()
    createdAt: Date;
}
