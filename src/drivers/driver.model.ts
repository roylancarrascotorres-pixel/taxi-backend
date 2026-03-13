import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Driver {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  phone: string;

  @Column({ type: 'float', default: 0 })
  rating: number;

  @Column({ default: true })
  available: boolean;

  @Column({ default: false })
  suspended: boolean;

  @Column({ default: 0 })
  cancelationsToday: number;

  @Column({ default: 0 })
  score: number;
}