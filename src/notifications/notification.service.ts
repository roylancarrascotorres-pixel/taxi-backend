import { Injectable } from '@nestjs/common';
import { Ride } from '../rides/ride.repository';
import { Driver } from '../drivers/driver.repository';

@Injectable()
export class NotificationService {
  // Envía la solicitud a un array de conductores
  async sendRideRequest(drivers: Driver[], ride: Ride) {
    // Aquí se conectaría con FCM / WebSocket para notificar
    console.log(`Enviando ride ${ride.id} a conductores:`, drivers.map(d => d.id));
  }
}