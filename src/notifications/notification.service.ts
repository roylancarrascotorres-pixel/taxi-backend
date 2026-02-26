// src/notifications/notification.service.ts
import { Injectable } from '@nestjs/common';
import { Ride } from '../rides/ride.repository';
import { Driver } from '../drivers/driver.repository';

@Injectable()
export class NotificationService {
  sendRideRequest(drivers: Driver[], ride: Ride) {
    const driverIds = drivers.map(d => d.id);
    console.log(`Enviando ride ${ride.id} a conductores:`, driverIds);
  }
}