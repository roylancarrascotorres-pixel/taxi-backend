// src/rides/rides.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RideService } from './rides.service';
import { RideController } from './rides.controller';
import { Ride } from './ride.entity';
import { Wallet } from '../wallet/wallet.entity';
import { HotZonesService } from '../matching/hotzones.service';
import { WalletsModule } from '../wallet/wallets.module';
import { NotificationModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ride, Wallet]),
    WalletsModule,        // ✅ Para WalletsService y repositorios
    NotificationModule,   // ✅ Para NotificationService
  ],
  controllers: [RideController],
  providers: [RideService, HotZonesService],
  exports: [RideService],
})
export class RidesModule {}