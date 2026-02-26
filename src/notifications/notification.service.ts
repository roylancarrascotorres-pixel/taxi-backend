import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationService {
  async sendRideRequest(drivers: any[], ride: any) {
    const driverIds = drivers.map(d => d.id);
    console.log(`Enviando ride ${ride.id} a conductores:`, driverIds.length ? driverIds : 'No hay drivers disponibles');
  }
}