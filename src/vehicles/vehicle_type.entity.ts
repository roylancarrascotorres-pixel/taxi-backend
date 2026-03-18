import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class VehicleType {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ type: 'int' })
  capacity!: number;

  @Column({ type: 'float' })
  baseFare!: number;

  @Column({ type: 'float' })
  pricePerKm!: number;

  @Column({ type: 'float' })
  pricePerMin!: number;
}