import { Injectable } from '@nestjs/common';
import { Ride } from '../rides/ride.entity';
import { Driver } from '../drivers/driver.entity';

@Injectable()
export class HotZonesService {
  private hotZones: { [zone: string]: number } = {};

  registerRide(ride: Ride) {
    const zone = this.getZoneKey(ride.originLat, ride.originLng);
    if (!this.hotZones[zone]) this.hotZones[zone] = 0;
    this.hotZones[zone]++;
  }

  prioritizeDrivers(drivers: Driver[], ride: Ride, useRating: boolean = true): Driver[] {
    const zone = this.getZoneKey(ride.originLat, ride.originLng);
    const demand = this.hotZones[zone] || 0;

    drivers.forEach(d => {
      let score = useRating ? d.rating * 10 : 0;
      score += demand;
      d.score = score;
    });

    return drivers.sort((a, b) => (b.score || 0) - (a.score || 0)).slice(0, 5);
  }

  private getZoneKey(lat: number, lng: number): string {
    const latKey = Math.floor(lat * 100) / 100;
    const lngKey = Math.floor(lng * 100) / 100;
    return `${latKey}_${lngKey}`;
  }
}