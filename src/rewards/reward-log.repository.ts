import { Injectable } from '@nestjs/common';

export type RewardLog = {
  driverId: string;
  amount: number;
  date: Date;
};

@Injectable()
export class RewardLogRepo {
  private logs: RewardLog[] = [];

  async create(log: RewardLog) {
    this.logs.push({ ...log, date: new Date() });
  }
}