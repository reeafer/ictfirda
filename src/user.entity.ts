/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ select: false }) // Don't return password in queries by default
  password: string;

  @Column({ default: 1000 })
  balance: number;

  @Column({ default: false })
  isAdmin: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
