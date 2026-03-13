// src/users/users.controller.ts
import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { WalletsService } from '../wallet/wallets.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly walletsService: WalletsService,
  ) {}

  @Post()
  async create(@Body() body: any) {
    return this.usersService.createUser(body.name, body.phone, body.password);
  }

  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: number) {
    return this.usersService.findById(id);
  }

  // Consultar saldo wallet
  @Get(':id/wallet')
  async getWallet(@Param('id') id: number) {
    const user = await this.usersService.findById(id);
    if (!user) return { error: 'Usuario no encontrado' };
    const balance = await this.walletsService.getBalance(user.wallet.id);
    return { userId: id, balance };
  }
}