import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Driver } from '../drivers/driver.entity';

@Entity()
export class Vehicle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string;

  @Column()
  plate: string;

  @ManyToOne(() => Driver)
  driver: Driver;
}