import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { RideService } from './rides.service';
import { Driver } from '../drivers/driver.entity';
import { Ride } from './ride.entity';

@Controller('rides')
export class RideController {
  constructor(private readonly rideService: RideService) {}

  // Solicitar viaje
  @Post('request')
  async requestRide(@Body() body: {
    clientId: number,
    pickupLat: number,
    pickupLng: number,
    dropLat: number,
    dropLng: number,
    vehicleTypeId: number,
    drivers: Driver[]
  }): Promise<Ride> {
    return this.rideService.requestRide(
      body.clientId,
      body.pickupLat,
      body.pickupLng,
      body.dropLat,
      body.dropLng,
      body.vehicleTypeId,
      body.drivers
    );
  }

  // Completar viaje
  @Post(':rideId/complete')
  async completeTrip(@Param('rideId') rideId: number, @Body('payWithWallet') payWithWallet: boolean) {
    return this.rideService.completeTrip(rideId, payWithWallet);
  }

  // Cancelar viaje
  @Post(':rideId/cancel')
  async cancelRide(@Param('rideId') rideId: number, @Body() body: { cancelBy: 'client' | 'driver', penalty: number }) {
    return this.rideService.cancelRide(rideId, body.cancelBy, body.penalty);
  }

  // Nuevo endpoint: chofer acepta viaje
  @Post(':rideId/accept')
  async acceptRide(
    @Param('rideId') rideId: number,
    @Body('driverId') driverId: number
  ): Promise<Ride> {
    return this.rideService.acceptRide(rideId, driverId);
  }
}