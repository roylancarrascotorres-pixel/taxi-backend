import { Module } from '@nestjs/common';
import { RidesService } from './rides.service';
import { RidesController } from './rides.controller';

import { RideRepo } from './ride.repository';
import { DriverRepo } from '../drivers/driver.repository';
import { WalletRepo } from '../wallet/wallet.repository';
import { RewardConfigRepo } from '../rewards/reward-config.repository';
import { RewardLogRepo } from '../rewards/reward-log.repository';
import { PlatformEarningsRepo } from '../platform/platform-earnings.repository';
import { SystemConfigRepo } from '../system/system-config.repository';
import { NotificationService } from '../notifications/notification.service';

@Module({
  controllers: [RidesController],
  providers: [
    RidesService,
    RideRepo,
    DriverRepo,
    WalletRepo,
    RewardConfigRepo,
    RewardLogRepo,
    PlatformEarningsRepo,
    SystemConfigRepo,
    NotificationService,
  ],
  exports: [RidesService],
})
export class RidesModule {}