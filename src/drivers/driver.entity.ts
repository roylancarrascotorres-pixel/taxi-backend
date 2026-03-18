import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { Wallet } from '../wallet/wallet.entity';

@Entity()
export class Driver {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  phone!: string;

  @Column()
  password!: string;

  @Column({ default: true })
  available!: boolean;

  @Column({ default: false })
  suspended!: boolean;

  @Column({ type: 'float', default: 5 })
  rating!: number;

  @Column({ default: 0 })
  cancelationsToday!: number;

  @Column({ type: 'float', default: 0 })
  score!: number;

  @OneToOne(() => Wallet, wallet => wallet.driver, { cascade: true })
  @JoinColumn()
  wallet!: Wallet;
}