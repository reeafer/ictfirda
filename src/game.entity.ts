import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('games')
export class Game {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    type: string;

    @Column('decimal', { precision: 10, scale: 2, default: 1.00 })
    min_bet: number;

    @Column('decimal', { precision: 10, scale: 2, default: 1000.00 })
    max_bet: number;

    @Column('decimal', { precision: 5, scale: 2, default: 96.00 })
    rtp: number;

    @CreateDateColumn()
    created_at: Date;
}
