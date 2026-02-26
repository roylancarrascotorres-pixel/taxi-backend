import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { Wallet } from '../wallet/wallet.entity';

@Entity()
export class Driver {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullName: string;

  @Column()
  phone: string;

  @Column()
  password: string;

  @OneToOne(() => Wallet, wallet => wallet.driver)
  wallet: Wallet;
}