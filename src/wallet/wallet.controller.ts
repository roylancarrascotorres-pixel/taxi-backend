// src/wallet/wallet.controller.ts
import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { WalletsService } from './wallets.service';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletsService: WalletsService) {}

  // Obtener balance
  @Get(':walletId')
  async getBalance(@Param('walletId') walletId: number) {
    return await this.walletsService.getBalance(walletId);
  }

  // Recargar wallet (solo admin)
  @Post('recharge')
  async rechargeWallet(@Body() body: { walletId: number; amount: number }) {
    return await this.walletsService.addBalance(body.walletId, body.amount);
  }

  // Restar saldo (opcional, para gastos)
  @Post('subtract')
  async subtractWallet(@Body() body: { walletId: number; amount: number }) {
    return await this.walletsService.subtractBalance(body.walletId, body.amount);
  }
}