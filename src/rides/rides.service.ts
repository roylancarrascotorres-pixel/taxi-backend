import { Injectable } from '@nestjs/common';
import { RideRepo, Ride } from '../rides/ride.repository';
import { DriverRepo, Driver } from '../drivers/driver.repository';
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
    private readonly notificationService: NotificationService,
  ) {}

  // ------------------------------
  // 1️⃣ CREAR SOLICITUD DE VIAJE
  async requestRide(client: any, originLat: number, originLng: number, destLat: number, destLng: number, vehicleType: string) {
    const ride: Ride = await this.rideRepo.create({
      id: Date.now().toString(),
      client,
      originLat,
      originLng,
      destLat,
      destLng,
      vehicleType,
      status: 'REQUESTED',
      totalCost: 0,
    });

    await this.findDrivers(ride);
    return ride;
  }

  // ------------------------------
  // 2️⃣ MATCHING INTELIGENTE
  async findDrivers(ride: Ride) {
    const config = await this.systemConfigRepo.get();
    const useRating = config.use_rating_rule;

    let drivers = await this.driverRepo.findAvailable(ride.vehicleType);

    drivers = drivers.map(driver => ({
      ...driver,
      distance: (driver.currentLat != null && driver.currentLng != null)
        ? this.calculateDistance(ride.originLat, ride.originLng, driver.currentLat, driver.currentLng)
        : Number.MAX_SAFE_INTEGER,
    }));

    if (useRating) {
      drivers.sort((a, b) => {
        const ratingDiff = (b.rating || 0) - (a.rating || 0);
        if (ratingDiff !== 0) return ratingDiff;
        const aDist = a.distance ?? Number.MAX_SAFE_INTEGER;
        const bDist = b.distance ?? Number.MAX_SAFE_INTEGER;
        return aDist - bDist;
      });
    } else {
      drivers.sort((a, b) => {
        const aDist = a.distance ?? Number.MAX_SAFE_INTEGER;
        const bDist = b.distance ?? Number.MAX_SAFE_INTEGER;
        return aDist - bDist;
      });
    }

    const top5 = drivers.slice(0, 5);
    this.notificationService.sendRideRequest(top5, ride);
  }

  // ------------------------------
  // 3️⃣ ACEPTAR VIAJE
  async acceptRide(ride: Ride, driver: Driver) {
    ride.driver = driver;
    ride.status = 'ACCEPTED';
    await this.rideRepo.save(ride);
    driver.canReceiveRides = false;
    await this.driverRepo.save(driver);
    return ride;
  }

  // ------------------------------
  // 4️⃣ INICIAR VIAJE
  async startRide(ride: Ride, driver: Driver) {
    ride.status = 'STARTED';
    ride.startedAt = new Date();
    await this.rideRepo.save(ride);
    return ride;
  }

  // ------------------------------
  // 5️⃣ FINALIZAR VIAJE
  async completeRide(
    ride: Ride,
    driverRating?: number,
    clientRating?: number,
    tip: number = 0,
    useWalletForTip: boolean = false
  ) {
    const config = await this.systemConfigRepo.get();

    // Calcula comisión y neto
    const commission = ride.totalCost * (config.commission_percentage / 100);
    const driverNet = ride.totalCost - commission;

    // Creditar chofer
    await this.driverWallet.credit(ride.driver!.id, driverNet);

    // Registrar comisión de plataforma
    await this.platformEarningsRepo.create({ rideId: ride.id, amount: commission, date: new Date() });

    // Propina
    if (tip > 0 && useWalletForTip) {
      await this.driverWallet.credit(ride.driver!.id, tip);
      await this.driverWallet.logTransaction(ride.driver!.id, 'TIP', tip);
    }

    // Premios diarios
    await this.checkDailyReward(ride.driver!.id);

    // Rating
    if (config.use_rating_rule && driverRating) {
      await this.updateDriverRating(ride.driver!.id, driverRating);
    }

    // Bloqueo automático si wallet < 0
    const driver = await this.driverRepo.findOne(ride.driver!.id);
    if (driver && driver.walletBalance < 0) {
      driver.canReceiveRides = false;
      await this.driverRepo.save(driver);
    }

    ride.status = 'COMPLETED';
    ride.completedAt = new Date();
    await this.rideRepo.save(ride);

    return ride;
  }

  // ------------------------------
  // 6️⃣ CANCELAR VIAJE
  async cancelRide(ride: Ride, userType: 'client' | 'driver' | 'admin') {
    ride.status = 'CANCELLED';
    ride.cancelledAt = new Date();
    ride.cancelledBy = userType;
    await this.rideRepo.save(ride);
    return ride;
  }

  // ------------------------------
  // 7️⃣ PREMIOS DIARIOS
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

  // ------------------------------
  // 8️⃣ RECARGA WALLET ADMIN
  async rechargeDriverWallet(driverId: string, amount: number) {
    const driver = await this.driverRepo.findOne(driverId);
    if (!driver) return;

    driver.walletBalance += amount;
    if (driver.walletBalance >= 0) driver.canReceiveRides = true;
    await this.driverRepo.save(driver);

    await this.driverWallet.logTransaction(driverId, 'ADMIN_RECHARGE', amount);
  }

  // ------------------------------
  // 9️⃣ DISTANCIA
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371;
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  private deg2rad(deg: number) {
    return deg * (Math.PI / 180);
  }

  // ------------------------------
  // 10️⃣ ACTUALIZAR RATING
  private async updateDriverRating(driverId: string, newScore: number) {
    const driver = await this.driverRepo.findOne(driverId);
    if (!driver) return;

    driver.rating = ((driver.rating * driver.totalTrips) + newScore) / (driver.totalTrips + 1);
    driver.totalTrips += 1;
    await this.driverRepo.save(driver);
  }
}