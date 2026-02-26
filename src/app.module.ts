import { Module } from '@nestjs/common';
import { SupabaseModule } from './supabase/supabase.module';
import { RidesModule } from './rides/rides.module';
import { DriversModule } from './drivers/drivers.module';
import { WalletsModule } from './wallet/wallets.module';
import { RewardsModule } from './rewards/rewards.module';
import { PlatformModule } from './platform/platform.module';
import { SystemModule } from './system/system.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    SupabaseModule,
    RidesModule,
    DriversModule,
    WalletsModule,
    RewardsModule,
    PlatformModule,
    SystemModule,
    NotificationsModule,
  ],
})
export class AppModule {}