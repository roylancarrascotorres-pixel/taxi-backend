// src/matching/driver-matching.service.ts
import { Injectable } from '@nestjs/common';
import { Driver } from '../drivers/driver.entity';

@Injectable()
export class DriverMatchingService {
  matchDrivers(drivers: Driver[]): Driver[] {
    const availableDrivers = drivers.filter(d => d.available && !d.suspended);

    availableDrivers.forEach(d => {
      d.score = (d.rating || 5) * 10 - (d.cancelationsToday || 0) * 2;
    });

    return availableDrivers.sort((a, b) => (b.score || 0) - (a.score || 0)).slice(0, 5);
  }
}