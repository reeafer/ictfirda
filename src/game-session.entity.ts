import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { Game } from './game.entity';

@Entity('game_sessions')
export class GameSession {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    user_id: number;

    @Column()
    game_id: number;

    @Column('decimal', { precision: 10, scale: 2 })
    bet_amount: number;

    @Column('decimal', { precision: 10, scale: 2, default: 0.00 })
    win_amount: number;

    @Column('jsonb', { nullable: true })
    game_data: any;

    @Column()
    result: string; // 'WIN', 'LOSS', 'PUSH'

    @CreateDateColumn()
    played_at: Date;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne(() => Game)
    @JoinColumn({ name: 'game_id' })
    game: Game;
}
