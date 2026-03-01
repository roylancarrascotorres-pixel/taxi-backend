import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { WalletService } from './wallet.service';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  // Obtener balance de cliente o chofer
  @Get(':userId')
  getBalance(@Param('userId') userId: string) {
    return this.walletService.getBalance(userId);
  }

  // Recargar wallet (solo admin)
  @Post('recharge')
  rechargeWallet(@Body() body: { userId: string; amount: number }) {
    return this.walletService.recharge(body.userId, body.amount);
  }

  // Historial de transacciones
  @Get('history/:userId')
  getHistory(@Param('userId') userId: string) {
    return this.walletService.getTransactionHistory(userId);
  }
}