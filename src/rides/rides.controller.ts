import { Controller, Post, Body } from '@nestjs/common';
import { RidesService } from './rides.service';
import { User } from '../users/user.entity';
import { Driver } from '../drivers/driver.repository';
import { Ride } from './ride.repository';

@Controller('rides')
export class RidesController {
  constructor(private readonly ridesService: RidesService) {}

  @Post('request')
  async requestRide(@Body() body: any): Promise<Ride> {
    const client = body.client as User;
    return this.ridesService.requestRide(
      client,
      body.originLat,
      body.originLng,
      body.destLat,
      body.destLng,
      body.vehicleType
    );
  }

  @Post('accept')
  async acceptRide(@Body() body: any): Promise<Ride> {
    const ride = body.ride as Ride;
    const driver = body.driver as Driver;
    return this.ridesService.acceptRide(ride, driver);
  }

  @Post('start')
  async startRide(@Body() body: any): Promise<Ride> {
    const ride = body.ride as Ride;
    const driver = body.driver as Driver;
    return this.ridesService.startRide(ride, driver);
  }

  @Post('complete')
  async completeRide(@Body() body: any): Promise<Ride> {
    const ride = body.ride as Ride;
    return this.ridesService.completeRide(
      ride,
      body.driverRating,
      body.clientRating,
      body.tip,
      body.useWalletForTip
    );
  }

  @Post('cancel')
  async cancelRide(@Body() body: any): Promise<Ride> {
    const ride = body.ride as Ride;
    return this.ridesService.cancelRide(ride, body.userType);
  }
}