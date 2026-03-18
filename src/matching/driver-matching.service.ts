// src/matching/driver-matching.service.ts
import { Injectable } from '@nestjs/common';
import { Driver } from '../drivers/driver.entity';

@Injectable()
export class DriverMatchingService {
  matchDrivers(drivers: Driver[]): Driver[] {
    // Solo drivers disponibles y activos
    const availableDrivers = drivers.filter(d => d.available && !d.suspended && d.wallet.balance >= 0);

    // Score = rating * 10 - cancelaciones
    availableDrivers.forEach(d => {
      d.score = (d.rating || 5) * 10 - (d.cancelationsToday || 0) * 2;
    });

    // Orden descendente por score y limitar a 5
    return availableDrivers.sort((a, b) => (b.score || 0) - (a.score || 0)).slice(0, 5);
  }
}