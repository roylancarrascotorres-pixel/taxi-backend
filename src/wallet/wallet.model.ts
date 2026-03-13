import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Wallet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column({ type: 'float', default: 0 })
  balance: number;
}