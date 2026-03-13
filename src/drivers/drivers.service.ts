// src/drivers/drivers.service.ts
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Driver } from './driver.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { WalletsService } from '../wallet/wallets.service';

@Injectable()
export class DriversService {
  constructor(
    @InjectRepository(Driver)
    private readonly driverRepo: Repository<Driver>,

    private readonly walletsService: WalletsService, // ✅ inyectado desde WalletsModule
  ) {}

  async createDriver(name: string, phone: string, password: string): Promise<Driver> {
    // Crear wallet usando WalletsService
    const wallet = await this.walletsService.createWallet();

    const driver = this.driverRepo.create({
      name,
      phone,
      password,
      available: true,
      suspended: false,
      rating: 5,
      cancelationsToday: 0,
      wallet,
    });

    return this.driverRepo.save(driver);
  }

  async findAll(): Promise<Driver[]> {
    return this.driverRepo.find({ relations: ['wallet'] });
  }

  async findById(id: number): Promise<Driver | null> {
    return this.driverRepo.findOne({ where: { id }, relations: ['wallet'] });
  }
}