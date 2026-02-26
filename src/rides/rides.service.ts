import { Injectable } from '@nestjs/common';
import { DriverRepo } from '../drivers/driver.repository';
import { RideRepo, Ride } from './ride.repository';
import { WalletRepo } from '../wallet/wallet.repository';
import { RewardConfigRepo } from '../rewards/reward-config.repository';
import { RewardLogRepo } from '../rewards/reward-log.repository';
import { PlatformEarningsRepo } from '../platform/platform-earnings.repository';
import { SystemConfigRepo } from '../system/system-config.repository';
import { NotificationService } from '../notifications/notification.service';

@Injectable()
export class RidesService {
  constructor(
    private readonly rideRepo: RideRepo,
    private readonly driverRepo: DriverRepo,
    private readonly driverWallet: WalletRepo,
    private readonly rewardConfigRepo: RewardConfigRepo,
    private readonly rewardLogRepo: RewardLogRepo,
    private readonly platformEarningsRepo: PlatformEarningsRepo,
    private readonly systemConfigRepo: SystemConfigRepo,
    private readonly notificationService: NotificationService
  ) {}

  async requestRide(client, originLat, originLng, destLat, destLng, vehicleType) {
    const ride: Ride = await this.rideRepo.create({
      id: Date.now().toString(),
      client,
      originLat,
      originLng,
      destLat,
      destLng,
      vehicleType,
      status: 'REQUESTED',
      totalCost: 0
    });

    await this.findDrivers(ride);
    return ride;
  }

  async findDrivers(ride: Ride) {
    const config = await this.systemConfigRepo.get();
    const useRating = config.use_rating_rule;

    let drivers = await this.driverRepo.findAvailable(ride.vehicleType);

    drivers = drivers.map(d => ({
      ...d,
      distance: this.calculateDistance(
        ride.originLat,
        ride.originLng,
        d.currentLat || 0,
        d.currentLng || 0
      )
    }));

    if (useRating) {
      drivers.sort((a, b) => {
        if (b.rating !== a.rating) return b.rating - a.rating;
        return a.distance - b.distance;
      });
    } else {
      drivers.sort((a, b) => a.distance - b.distance);
    }

    const top5 = drivers.slice(0, 5);
    this.notificationService.sendRideRequest(top5, ride);
  }

  async acceptRide(ride: Ride, driver) {
    ride.driver = driver;
    ride.status = 'ACCEPTED';
    await this.rideRepo.save(ride);
    driver.canReceiveRides = false;
    await this.driverRepo.save(driver);
    return ride;
  }

  async startRide(ride: Ride, driver) {
    ride.status = 'STARTED';
    ride.startedAt = new Date();
    await this.rideRepo.save(ride);
    return ride;
  }

  async completeRide(ride: Ride, driverRating?, clientRating?, tip?, useWalletForTip?) {
    const config = await this.systemConfigRepo.get();

    const commission = ride.totalCost * (config.commission_percentage / 100);
    const driverNet = ride.totalCost - commission;

    await this.driverWallet.credit(ride.driver.id, driverNet);
    await this.platformEarningsRepo.create({ rideId: ride.id, amount: commission, date: new Date() });

    if (tip && useWalletForTip) {
      await this.driverWallet.credit(ride.driver.id, tip);
    }

    ride.status = 'COMPLETED';
    ride.completedAt = new Date();
    await this.rideRepo.save(ride);

    return ride;
  }

  async cancelRide(ride: Ride, userType) {
    ride.status = 'CANCELLED';
    await this.rideRepo.save(ride);
    return ride;
  }

  private calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(this.deg2rad(lat1)) *
      Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  private deg2rad(deg) {
    return deg * (Math.PI / 180);
  }
}