import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RidesModule } from './rides/rides.module';
import { DriversModule } from './drivers/drivers.module';
import { WalletsModule } from './wallet/wallets.module';
import { RewardsModule } from './rewards/rewards.module';
import { PlatformModule } from './platform/platform.module';
import { SystemModule } from './system/system.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: 'postgresql://postgres:k8kFeuEUNsxxENVm@db.htawzwkztxtssvsxrzdu.supabase.co:5432/postgres',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // solo desarrollo, en producción poner false
      logging: false,
    }),
    RidesModule,
    DriversModule,
    WalletsModule,
    RewardsModule,
    PlatformModule,
    SystemModule,
    NotificationsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}