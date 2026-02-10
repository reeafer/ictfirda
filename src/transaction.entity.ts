import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('transactions')
export class Transaction {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    user_id: number;

    @Column('decimal', { precision: 10, scale: 2 })
    amount: number;

    @Column()
    type: string; // 'DEPOSIT', 'WITHDRAWAL', 'BET', 'WIN'

    @Column('text', { nullable: true })
    description: string;

    @CreateDateColumn()
    created_at: Date;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;
}
