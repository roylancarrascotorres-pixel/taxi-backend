import { Injectable } from '@nestjs/common';
import { DriverRepo, Driver } from '../drivers/driver.repository';
import { RideRepo, Ride } from '../rides/ride.repository';
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

    let drivers: Driver[] = await this.driverRepo.findAvailable(ride.vehicleType);

    // Calculamos distancia
    drivers = drivers.map(driver => ({
      ...driver,
      distance: this.calculateDistance(ride.originLat, ride.originLng, driver.currentLat ?? 0, driver.currentLng ?? 0),
    }));

    // Ordenamos según rating y distancia
    if (useRating) {
      drivers.sort((a, b) => {
        if (b.rating !== a.rating) return b.rating - a.rating;
        return (a.distance ?? 0) - (b.distance ?? 0);
      });
    } else {
      drivers.sort((a, b) => (a.distance ?? 0) - (b.distance ?? 0));
    }

    const top5 = drivers.slice(0, 5);
    this.notificationService.sendRideRequest(top5, ride);
  }

  // ------------------------------
  // 3️⃣ CHOFER ACEPTA VIAJE
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
    tip?: number,
    useWalletForTip?: boolean,
  ) {
    const config = await this.systemConfigRepo.get();

    // Calcula comisión
    const commission = ride.totalCost * (config.commission_percentage / 100);
    const driverNet = ride.totalCost - commission;

    // Creditar chofer
    await this.driverWallet.credit(ride.driver?.id ?? '', driverNet);

    // Registrar comisión
    await this.platformEarningsRepo.create({ rideId: ride.id, amount: commission, date: new Date() });

    // Propina
    if (tip && useWalletForTip && ride.driver) {
      await this.driverWallet.credit(ride.driver.id, tip);
      await this.driverWallet.logTransaction(ride.driver.id, 'TIP', tip);
    }

    // Cashback cliente
    if (ride.promotionPercent) {
      const cashback = ride.totalCost * (ride.promotionPercent / 100);
      await this.clientWallet.credit(ride.client.id, cashback);
      await this.clientWallet.logTransaction(ride.client.id, 'PROMOTION_CASHBACK', cashback);
    }

    // Premios diarios
    if (ride.driver) await this.checkDailyReward(ride.driver.id);

    // Rating
    if (config.use_rating_rule && ride.driver && driverRating) {
      await this.updateDriverRating(ride.driver.id, driverRating);
    }

    // Bloqueo automático si wallet < 0
    const driver = ride.driver;
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
  async cancelRide(ride: Ride, userType: string) {
    ride.status = 'CANCELLED';
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
    const R = 6371; // km
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