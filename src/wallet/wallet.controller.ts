// src/wallet/wallet.controller.ts
import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { WalletTransactionType } from './wallet-transaction.entity';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletsService: WalletsService) {}

  @Get(':walletId/balance')
  async getBalance(@Param('walletId') walletId: number) {
    const balance = await this.walletsService.getBalance(walletId);
    return { walletId, balance };
  }

  @Post('add')
  async addBalance(@Body() body: { walletId: number, amount: number }) {
    return this.walletsService.applyTransaction(body.walletId, body.amount, WalletTransactionType.BONUS, 'manual_add');
  }

  @Post('subtract')
  async subtractBalance(@Body() body: { walletId: number, amount: number }) {
    return this.walletsService.applyTransaction(body.walletId, -body.amount, WalletTransactionType.PENALTY, 'manual_subtract');
  }
}