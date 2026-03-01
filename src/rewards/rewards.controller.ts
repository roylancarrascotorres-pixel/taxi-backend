// src/rewards/rewards.controller.ts
import { Controller, Get, Param } from '@nestjs/common';
import { RewardsService } from './rewards.service';

@Controller('rewards')
export class RewardsController {
  constructor(private readonly rewardsService: RewardsService) {}

  @Get('log/:driverId')
  async getLog(@Param('driverId') driverId: number) {
    return await this.rewardsService.getDriverRewards(driverId);
  }

  @Get('today/:driverId')
  async getToday(@Param('driverId') driverId: number) {
    return await this.rewardsService.getTodaysRewards(driverId);
  }
}