import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { Wallet } from '../wallet/wallet.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  phone!: string;

  @Column()
  password!: string;

  @Column({ nullable: true })
  fcmToken?: string;

  @Column({ type: 'enum', enum: ['driver','client'], default: 'client' })
  role!: 'driver' | 'client';

  @OneToOne(() => Wallet, wallet => wallet.user, { cascade: true })
  @JoinColumn()
  wallet!: Wallet;
}