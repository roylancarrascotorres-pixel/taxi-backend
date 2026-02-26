export interface Ride {
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
  cancelledBy?: 'client' | 'driver' | 'admin';

  tip?: number;
  promotionPercent?: number;
}

export class RideRepo {
  private rides: Ride[] = [];

  async create(data: Ride): Promise<Ride> {
    this.rides.push(data);
    return data;
  }

  async save(ride: Ride): Promise<Ride> {
    const index = this.rides.findIndex(r => r.id === ride.id);
    if (index !== -1) {
      this.rides[index] = ride;
    }
    return ride;
  }

  async findById(id: string): Promise<Ride | undefined> {
    return this.rides.find(r => r.id === id);
  }

  async countCompletedTodayByDriver(driverId: string): Promise<number> {
    const today = new Date().toDateString();
    return this.rides.filter(r =>
      r.driver?.id === driverId &&
      r.status === 'COMPLETED' &&
      r.completedAt &&
      r.completedAt.toDateString() === today
    ).length;
  }
}