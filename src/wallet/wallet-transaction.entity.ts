import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Wallet } from './wallet.entity';

export enum WalletTransactionType {
  RIDE_PAYMENT = 'ride',
  DRIVER_EARNING = 'ride',
  PENALTY = 'penalty',
  BONUS = 'bonus',
}

@Entity()
export class WalletTransaction {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Wallet)
  @JoinColumn({ name: 'wallet_id' })
  wallet!: Wallet;

  @Column({ type: 'enum', enum: WalletTransactionType })
  type!: WalletTransactionType;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  amount!: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;

  @Column({ type: 'varchar', nullable: true })
  description?: string;
} !