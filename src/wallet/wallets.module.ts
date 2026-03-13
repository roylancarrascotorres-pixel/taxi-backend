// src/wallet/wallets.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletController } from './wallet.controller';
import { WalletsService } from './wallets.service';
import { Wallet } from './wallet.entity';
import { WalletTransaction } from './wallet-transaction.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Wallet, WalletTransaction]) // ✅ Incluye ambos repositorios
  ],
  controllers: [WalletController],
  providers: [WalletsService],
  exports: [WalletsService], // Para usar en AdminModule, UsersModule, AppModule
})
export class WalletsModule {}