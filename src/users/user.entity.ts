import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { Wallet } from '../wallet/wallet.entity';

export type UserRole = 'client' | 'driver' | 'admin';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullName: string;

  @Column()
  phone: string;

  @Column()
  password: string;

  @OneToOne(() => Wallet, wallet => wallet.user)
  wallet: Wallet;

  @Column({ type: 'enum', enum: ['client', 'driver', 'admin'], default: 'client' })
  role: UserRole;
}