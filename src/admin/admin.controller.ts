// src/admin/admin.controller.ts
import { Controller, Post, Body, Param, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { WalletsService } from '../wallet/wallets.service';
import { NotificationService } from '../notifications/notification.service';
import { WalletTransactionType } from '../wallet/wallet-transaction.entity';

@Controller('admin')
@UseGuards(AuthGuard, RolesGuard)
export class AdminController {
  constructor(
    private readonly walletsService: WalletsService,
    private readonly notificationService: NotificationService,
  ) {}

  @Post('wallet/:walletId/recharge')
  @Roles(Role.ADMIN)
  async rechargeWallet(@Param('walletId') walletId: number, @Body('amount') amount: number) {
    return this.walletsService.rechargeWallet(walletId, amount);
  }

  @Get('wallet/:walletId/balance')
  @Roles(Role.ADMIN)
  async getBalance(@Param('walletId') walletId: number) {
    const balance = await this.walletsService.getBalance(walletId);
    return { walletId, balance };
  }

  @Post('wallet/:walletId/reward')
  @Roles(Role.ADMIN)
  async applyReward(@Param('walletId') walletId: number, @Body('amount') amount: number) {
    return this.walletsService.applyTransaction(
      walletId,
      amount,
      WalletTransactionType.BONUS,
      'manual_reward'
    );
  }

  @Post('notify/user')
  @Roles(Role.ADMIN)
  async notifyUser(@Body() body: { userId: number; title: string; message: string }) {
    await this.notificationService.sendToUser(body.userId, body.title, body.message);
    return { message: `Notificación enviada al usuario ${body.userId}` };
  }

  @Post('notify/drivers')
  @Roles(Role.ADMIN)
  async notifyDrivers(@Body() body: { title: string; message: string }) {
    await this.notificationService.sendToAllDrivers(body.title, body.message);
    return { message: 'Notificación enviada a todos los choferes' };
  }

  @Post('notify/clients')
  @Roles(Role.ADMIN)
  async notifyClients(@Body() body: { title: string; message: string }) {
    await this.notificationService.sendToAllClients(body.title, body.message);
    return { message: 'Notificación enviada a todos los clientes' };
  }

  @Post('send-notification')
  async sendNotification(@Body() body: any) {
    return await this.notificationService.sendPush(
      body.token,
      body.title,
      body.message
    );
  }
}