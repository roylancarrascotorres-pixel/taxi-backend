import { Injectable } from '@nestjs/common';

export type Driver = {
  id: string;
  isOnline: boolean;
  status: 'AVAILABLE' | 'BUSY';
  walletBalance: number;
  vehicleType: string;
  rating: number;
  totalTrips: number;
  canReceiveRides: boolean;
  currentLat?: number;
  currentLng?: number;
  distance?: number;
};

@Injectable()
export class DriverRepo {
  private drivers: Driver[] = [];

  async findAvailable(vehicleType: string): Promise<Driver[]> {
    return this.drivers.filter(d =>
      d.isOnline &&
      d.status === 'AVAILABLE' &&
      d.walletBalance >= 0 &&
      d.canReceiveRides &&
      d.vehicleType === vehicleType
    );
  }

  async findOne(id: string): Promise<Driver | undefined> {
    return this.drivers.find(d => d.id === id);
  }

  async save(driver: Driver) {
    const idx = this.drivers.findIndex(d => d.id === driver.id);
    if (idx >= 0) this.drivers[idx] = driver;
    else this.drivers.push(driver);
  }
}