import { Injectable } from '@nestjs/common';

export type Earning = {
  rideId: string;
  amount: number;
  date: Date;
};

@Injectable()
export class PlatformEarningsRepo {
  private earnings: Earning[] = [];

  async create(log: Earning) {
    this.earnings.push({ ...log, date: new Date() });
  }
}