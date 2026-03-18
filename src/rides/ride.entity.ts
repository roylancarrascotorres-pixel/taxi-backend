import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';
import { Driver } from '../drivers/driver.entity';

export type RideStatus = 'requested' | 'accepted' | 'started' | 'completed' | 'cancelled';

@Entity()
export class Ride {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User)
  client!: User;

  @ManyToOne(() => Driver)
  driver!: Driver;

  @Column({ type: 'decimal', precision: 10, scale: 6 })
  originLat!: number;

  @Column({ type: 'decimal', precision: 10, scale: 6 })
  originLng!: number;

  @Column({ type: 'decimal', precision: 10, scale: 6 })
  destLat!: number;

  @Column({ type: 'decimal', precision: 10, scale: 6 })
  destLng!: number;

  @Column()
  vehicleType!: string;

  @Column({ type: 'float', default: 0 })
  driverRating!: number;

  @Column({ type: 'float', default: 0 })
  clientRating!: number;

  @Column({ type: 'float', default: 0 })
  totalCost!: number;

  @Column({ type: 'timestamp', nullable: true })
  startedAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  completedAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  cancelledAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  waitStart?: Date;

  @Column({ type: 'timestamp', nullable: true })
  startEnd?: Date;

  @Column({ type: 'enum', enum: ['requested','accepted','started','completed','cancelled'], default: 'requested' })
  status!: RideStatus;
}