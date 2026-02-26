import { Injectable } from '@nestjs/common';

export type Ride = {
  id: string;

  client: any;
  driver?: any;

  originLat: number;
  originLng: number;
  destLat: number;
  destLng: number;

  vehicleType: string;

  status: 'REQUESTED' | 'ACCEPTED' | 'STARTED' | 'COMPLETED' | 'CANCELLED';

  totalCost: number;

  tip?: number;
  promotionPercent?: number;

  startedAt?: Date;
  completedAt?: Date;
  cancelledAt?: Date;

  driverRating?: number;
  clientRating?: number;
};

@Injectable()
export class RideRepo {
  private rides: Ride[] = [];

  async create(data: Ride): Promise<Ride> {
    this.rides.push(data);
    return data;
  }

  async findOne(id: string): Promise<Ride | undefined> {
    return this.rides.find(r => r.id === id);
  }

  async save(ride: Ride) {
    const index = this.rides.findIndex(r => r.id === ride.id);
    if (index >= 0) {
      this.rides[index] = ride;
    }
  }

  async countCompletedTodayByDriver(driverId: string): Promise<number> {
    const today = new Date().toDateString();
    return this.rides.filter(r =>
      r.driver?.id === driverId &&
      r.status === 'COMPLETED' &&
      r.completedAt &&
      new Date(r.completedAt).toDateString() === today
    ).length;
  }
}