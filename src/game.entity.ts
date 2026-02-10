/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('games')
export class Game {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column('decimal', { precision: 10, scale: 2, default: 1.0 })
  min_bet: number;

  @Column('decimal', { precision: 10, scale: 2, default: 1000.0 })
  max_bet: number;

  @Column('decimal', { precision: 5, scale: 2, default: 96.0 })
  rtp: number;

  @CreateDateColumn()
  created_at: Date;
}
