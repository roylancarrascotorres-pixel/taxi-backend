import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle } from './vehicle.entity';
import { User } from '../users/user.entity';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(Vehicle)
    private vehiclesRepo: Repository<Vehicle>,
    @InjectRepository(User)
    private usersRepo: Repository<User>,
  ) {}

  async createVehicle(type: string, plate: string, driverId: number): Promise<Vehicle> {
    const driver = await this.usersRepo.findOne({ where: { id: driverId } });
    if (!driver) throw new Error('Driver not found');

    const vehicle = this.vehiclesRepo.create({
      type,
      plate,
      driver,
    });

    return this.vehiclesRepo.save(vehicle);
  }

  async findAll(): Promise<Vehicle[]> {
    return this.vehiclesRepo.find({ relations: ['driver'] });
  }

  async findById(id: number): Promise<Vehicle> {
    const vehicle = await this.vehiclesRepo.findOne({ where: { id }, relations: ['driver'] });
    if (!vehicle) throw new Error('Vehicle not found');
    return vehicle;
  }
}