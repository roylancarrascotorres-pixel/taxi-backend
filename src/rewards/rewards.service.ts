import { Injectable } from '@nestjs/common';
import { Repository, MoreThan } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DailyReward } from './daily-reward.entity';
import { Driver } from '../drivers/driver.entity';

@Injectable()
export class RewardsService {
  constructor(
    @InjectRepository(DailyReward)
    private rewardRepo: Repository<DailyReward>,
  ) {}

  // Devuelve las recompensas de un chofer
  async getDriverRewards(driverId: number) {
    return await this.rewardRepo.find({
      where: { driver: { id: driverId } },
      order: { created_at: 'DESC' },
    });
  }

  // Limpia todas las recompensas
  async clearAllRewards() {
    await this.rewardRepo.clear();
  }

  // Crea una nueva recompensa diaria
  async createReward(driver: Driver, totalRides: number, amount: number) {
    const reward = this.rewardRepo.create({
      driver,
      totalRides,
      amount,
    });
    return await this.rewardRepo.save(reward);
  }

  // Ejemplo de función para recompensas del día
  async getTodaysRewards(driverId: number) {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // inicio del día como Date
    return await this.rewardRepo.find({
      where: { driver: { id: driverId }, created_at: MoreThan(today) },
    });
  }
}