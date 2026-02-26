import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { User } from '../users/user.entity';
import { Driver } from '../drivers/driver.entity';

@Entity()
export class Wallet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'float', default: 0 })
  balance: number;

  @OneToOne(() => User, user => user.wallet)
  user: User;

  @OneToOne(() => Driver, driver => driver.wallet)
  driver: Driver;
}