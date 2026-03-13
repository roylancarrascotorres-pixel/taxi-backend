import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from '../users/user.entity'
import { Driver } from '../drivers/driver.entity'
import { Wallet } from '../wallet/wallet.entity'
import { Ride } from '../rides/ride.entity'
import { DailyReward } from '../rewards/daily-reward.entity'
import { Vehicle } from '../vehicles/vehicle.entity'
import { NotificationModule } from '../notifications/notifications.module'
import { WalletsModule } from '../wallet/wallets.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Driver,
      Wallet,
      Ride,
      DailyReward,
      Vehicle
    ]),
    NotificationModule,
    WalletsModule,
  ],
  controllers: [AdminController],
})
export class AdminModule {}