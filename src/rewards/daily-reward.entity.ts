import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { Driver } from '../drivers/driver.entity';

@Entity()
export class DailyReward {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Driver)
  driver!: Driver;

  @Column({ type: 'float', default: 0 })
  amount!: number;

  @CreateDateColumn()
  created_at!: Date;

  @Column({ default: 0 })
  totalRides!: number;
}