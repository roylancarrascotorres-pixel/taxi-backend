import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Driver } from '../drivers/driver.entity';

@Entity()
export class DailyReward {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  points: number;

  @ManyToOne(() => Driver)
  driver: Driver;

  @Column()
  totalRides: number;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'float' })
  amount: number;
}