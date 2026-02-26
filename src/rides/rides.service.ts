// src/rides/rides.service.ts
import { Injectable } from '@nestjs/common';
import { DriverRepo, Driver } from '../drivers/driver.repository';
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
    private readonly clientWallet: WalletRepo,
    private readonly rewardConfigRepo: RewardConfigRepo,
    private readonly rewardLogRepo: RewardLogRepo,
    private readonly platformEarningsRepo: PlatformEarningsRepo,
    private readonly systemConfigRepo: SystemConfigRepo,
    private readonly notificationService: NotificationService
  ) {}

  // ------------------------------ REQUEST RIDE
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

  // ------------------------------ MATCHING INTELIGENTE
  async findDrivers(ride: Ride) {
    const config = await this.systemConfigRepo.get();
    const useRating = config.use_rating_rule;

    let drivers: Driver[] = await this.driverRepo.findAvailable(ride.vehicleType);

    // calcular distancia
    drivers = drivers.map(driver => ({
      ...driver,
      distance: this.calculateDistance(
        ride.originLat,
        ride.originLng,
        driver.currentLat || 0,
        driver.currentLng || 0
      )
    }));

    // ordenar
    if (useRating) {
      drivers.sort((a, b) => (b.rating - a.rating) || (a.distance - b.distance));
    } else {
      drivers.sort((a, b) => a.distance - b.distance);
    }

    const top5 = drivers.slice(0, 5);
    this.notificationService.sendRideRequest(top5, ride);
  }

  // ------------------------------ ACCEPT RIDE
  async acceptRide(ride: Ride, driver: Driver) {
    ride.driver = driver;
    ride.status = 'ACCEPTED';
    await this.rideRepo.save(ride);
    driver.canReceiveRides = false;
    await this.driverRepo.save(driver);
    return ride;
  }

  // ------------------------------ START RIDE
  async startRide(ride: Ride, driver: Driver) {
    ride.status = 'STARTED';
    ride.startedAt = new Date();
    await this.rideRepo.save(ride);
    return ride;
  }

  // ------------------------------ COMPLETE RIDE
  async completeRide(ride: Ride, driverRating?: number, clientRating?: number, tip?: number, useWalletForTip?: boolean) {
    const config = await this.systemConfigRepo.get();

    // comisión
    const commission = ride.totalCost * (config.commission_percentage / 100);
    const driverNet = ride.totalCost - commission;

    // acreditar chofer
    await this.driverWallet.credit(ride.driver.id, driverNet);
    await this.platformEarningsRepo.create({ rideId: ride.id, amount: commission, date: new Date() });

    // propina
    if (tip && useWalletForTip) {
      await this.driverWallet.credit(ride.driver.id, tip);
      await this.driverWallet.logTransaction(ride.driver.id, 'TIP', tip);
    }

    // cashback cliente
    if (ride.promotionPercent) {
      const cashback = ride.totalCost * (ride.promotionPercent / 100);
      await this.clientWallet.credit(ride.client.id, cashback);
      await this.clientWallet.logTransaction(ride.client.id, 'PROMOTION_CASHBACK', cashback);
    }

    // premios diarios
    await this.checkDailyReward(ride.driver.id);

    // rating
    if (config.use_rating_rule && driverRating) {
      await this.updateDriverRating(ride.driver.id, driverRating);
    }

    // bloqueo automático si wallet < 0
    if (ride.driver.walletBalance < 0) {
      ride.driver.canReceiveRides = false;
      await this.driverRepo.save(ride.driver);
    }

    ride.status = 'COMPLETED';
    ride.completedAt = new Date();
    await this.rideRepo.save(ride);
    return ride;
  }

  // ------------------------------ CANCEL RIDE
  async cancelRide(ride: Ride, userType: string) {
    ride.status = 'CANCELLED';
    await this.rideRepo.save(ride);
    return ride;
  }

  // ------------------------------ PREMIOS DIARIOS
  private async checkDailyReward(driverId: string) {
    const todayTrips = await this.rideRepo.countCompletedTodayByDriver(driverId);
    const rewards = await this.rewardConfigRepo.findActive();
    for (const reward of rewards) {
      if (todayTrips === reward.required_trips) {
        await this.driverWallet.credit(driverId, reward.reward_amount);
        await this.rewardLogRepo.create({ driverId, amount: reward.reward_amount, date: new Date() });
      }
    }
  }

  // ------------------------------ DISTANCIA
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
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

  private deg2rad(deg: number) {
    return deg * (Math.PI / 180);
  }

  // ------------------------------ ACTUALIZAR RATING
  private async updateDriverRating(driverId: string, newScore: number) {
    const driver = await this.driverRepo.findOne(driverId);
    driver.rating = ((driver.rating * driver.totalTrips) + newScore) / (driver.totalTrips + 1);
    driver.totalTrips += 1;
    await this.driverRepo.save(driver);
  }
}