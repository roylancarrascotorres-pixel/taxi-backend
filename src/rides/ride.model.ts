import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

export enum RideStatus {
  REQUESTED = 'REQUESTED',
  DRIVER_ASSIGNED = 'DRIVER_ASSIGNED',
  DRIVER_ARRIVED = 'DRIVER_ARRIVED',
  TRIP_STARTED = 'TRIP_STARTED',
  TRIP_COMPLETED = 'TRIP_COMPLETED',
  CANCELLED = 'CANCELLED'
}

@Entity()
export class Ride {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  clientId: number;

  @Column()
  driverId: number;

  @Column()
  vehicleTypeId: number;

  @Column({ type: 'float' })
  pickupLat: number;

  @Column({ type: 'float' })
  pickupLng: number;

  @Column({ type: 'float' })
  dropLat: number;

  @Column({ type: 'float' })
  dropLng: number;

  @Column({ type: 'float' })
  price: number;

  @Column({ type: 'enum', enum: RideStatus, default: RideStatus.REQUESTED })
  status: RideStatus;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}