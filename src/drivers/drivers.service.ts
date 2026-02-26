import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Driver } from './driver.entity';
import { Wallet } from '../wallet/wallet.entity';

@Injectable()
export class DriversService {
  constructor(
    @InjectRepository(Driver)
    private driverRepo: Repository<Driver>,
    @InjectRepository(Wallet)
    private walletRepo: Repository<Wallet>,
  ) {}

  async createDriver(name: string, phone: string, password: string): Promise<Driver> {
    const wallet = this.walletRepo.create({ balance: 0 });
    await this.walletRepo.save(wallet);

    const driver = this.driverRepo.create({
      fullName: name,
      phone,
      password,
      wallet,
    });

    return this.driverRepo.save(driver);
  }

  async findAll(): Promise<Driver[]> {
    return this.driverRepo.find({ relations: ['wallet'] });
  }

  async findById(id: number): Promise<Driver> {
    const driver = await this.driverRepo.findOne({ where: { id }, relations: ['wallet'] });
    if (!driver) throw new Error('Driver not found');
    return driver;
  }
}