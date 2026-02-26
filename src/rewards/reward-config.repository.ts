import { Injectable } from '@nestjs/common';

export type RewardConfig = {
  required_trips: number;
  reward_amount: number;
  active: boolean;
};

@Injectable()
export class RewardConfigRepo {
  private rewards: RewardConfig[] = [];

  async findActive(): Promise<RewardConfig[]> {
    return this.rewards.filter(r => r.active);
  }
}