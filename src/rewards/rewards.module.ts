import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RewardsService } from './rewards.service';
import { DailyReward } from './daily-reward.entity';
import { Driver } from '../drivers/driver.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DailyReward, Driver])],
  providers: [RewardsService],
  exports: [RewardsService],
})
export class RewardsModule {}