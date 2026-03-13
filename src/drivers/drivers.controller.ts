// src/drivers/drivers.controller.ts
import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { DriversService } from './drivers.service';
import { WalletsService } from '../wallet/wallets.service';

@Controller('drivers')
export class DriversController {
  constructor(
    private readonly driversService: DriversService,
    private readonly walletsService: WalletsService,
  ) {}

  @Post()
  async create(@Body() body: any) {
    return this.driversService.createDriver(body.name, body.phone, body.password);
  }

  @Get()
  async findAll() {
    return this.driversService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: number) {
    return this.driversService.findById(id);
  }

  // Consultar saldo wallet
  @Get(':id/wallet')
  async getWallet(@Param('id') id: number) {
    const driver = await this.driversService.findById(id);
    if (!driver) return { error: 'Chofer no encontrado' };
    const balance = await this.walletsService.getBalance(driver.wallet.id);
    return { driverId: id, balance };
  }
}