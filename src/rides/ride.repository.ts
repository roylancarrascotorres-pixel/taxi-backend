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
  startedAt?: Date;
  completedAt?: Date;
  cancelledAt?: Date;
};

@Injectable()
export class RideRepo {
  private rides: Ride[] = [];

  async create(data: Ride) {
    this.rides.push(data);
    return data;
  }

  async findOne(id: string) {
    return this.rides.find(r => r.id === id);
  }

  async save(ride: Ride) {
    const idx = this.rides.findIndex(r => r.id === ride.id);
    if (idx >= 0) this.rides[idx] = ride;
  }
}