import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RewardsService } from './rewards.service';
import { RewardsController } from './rewards.controller';
import { DailyReward } from './daily-reward.entity';
import { Driver } from '../drivers/driver.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DailyReward, Driver])],
  controllers: [RewardsController],
  providers: [RewardsService],
  exports: [RewardsService],
})
export class RewardsModule {}