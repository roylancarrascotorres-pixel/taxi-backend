import { Controller, Get, Param } from '@nestjs/common';
import { RewardsService } from './rewards.service';

@Controller('rewards')
export class RewardsController {
  constructor(private readonly rewardsService: RewardsService) {}

  // Configuración de recompensas activas
  @Get('config')
  getConfig() {
    return this.rewardsService.getConfig();
  }

  // Historial de recompensas por chofer
  @Get('log/:driverId')
  getLog(@Param('driverId') driverId: string) {
    return this.rewardsService.getLog(driverId);
  }
}