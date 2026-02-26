import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from './wallet.entity';
import { WalletRepo } from './wallet.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Wallet])],
  providers: [WalletRepo],
  exports: [WalletRepo, TypeOrmModule],
})
export class WalletsModule {}