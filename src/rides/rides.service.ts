import { Injectable } from '@nestjs/common';
import { RideRepo, Ride } from './ride.repository';
import { DriverRepo, Driver } from '../drivers/driver.repository';
import { WalletRepo } from '../wallet/wallet.repository';
import { RewardConfigRepo } from '../rewards/reward-config.repository';
import { RewardLogRepo } from '../rewards/reward-log.repository';
import { PlatformEarningsRepo } from '../platform/platform-earnings.repository';
import { SystemConfigRepo } from '../system/system-config.repository';
import { NotificationService } from '../notifications/notification.service';
import { calculateDistance } from '../utils/distance.util';

@Injectable()
export class RidesService {
  constructor(
    private readonly rideRepo: RideRepo,
    private readonly driverRepo: DriverRepo,
    private readonly walletRepo: WalletRepo,
    private readonly rewardConfigRepo: RewardConfigRepo,
    private readonly rewardLogRepo: RewardLogRepo,
    private readonly platformRepo: PlatformEarningsRepo,
    private readonly systemConfigRepo: SystemConfigRepo,
    private readonly notificationService: NotificationService,
  ) {}

  // -------------------------------
  // 1️⃣ Solicitud de viaje
  async requestRide(client: any, originLat: number, originLng: number, destLat: number, destLng: number, vehicleType: string): Promise<Ride> {
    const ride: Ride = {
      id: Date.now().toString(),
      client,
      originLat,
      originLng,
      destLat,
      destLng,
      vehicleType,
      status: 'REQUESTED',
      totalCost: 0,
    };

    await this.rideRepo.create(ride);
    await this.matchDrivers(ride);

    return ride;
  }

  // -------------------------------
  // 2️⃣ Matching inteligente
  async matchDrivers(ride: Ride) {
    const config = await this.systemConfigRepo.get();
    const useRating = config.use_rating_rule ?? false;

    let drivers: Driver[] = await this.driverRepo.findAvailable(ride.vehicleType);

    // Calcular distancia
    drivers = drivers.map(d => ({
      ...d,
      distance: calculateDistance(ride.originLat, ride.originLng, d.currentLat ?? 0, d.currentLng ?? 0),
    }));

    // Ordenar por rating y distancia
    drivers.sort((a, b) => {
      if (useRating && (b.rating !== a.rating)) return (b.rating ?? 0) - (a.rating ?? 0);
      return (a.distance ?? 0) - (b.distance ?? 0);
    });

    const top5 = drivers.slice(0, 5);

    await this.notificationService.sendRideRequest(top5, ride);
  }

  // -------------------------------
  // 3️⃣ Aceptar viaje
  async acceptRide(ride: Ride, driver: Driver): Promise<Ride> {
    const dbRide = await this.rideRepo.findOne(ride.id);
    if (!dbRide) throw new Error('Ride no encontrado');

    dbRide.driver = driver;
    dbRide.status = 'ACCEPTED';

    // Bloquear conductor hasta que inicie viaje
    driver.canReceiveRides = false;
    await this.driverRepo.save(driver);

    await this.rideRepo.save(dbRide);
    return dbRide;
  }

  // -------------------------------
  // 4️⃣ Iniciar viaje
  async startRide(ride: Ride, driver: Driver): Promise<Ride> {
    const dbRide = await this.rideRepo.findOne(ride.id);
    if (!dbRide) throw new Error('Ride no encontrado');

    dbRide.status = 'STARTED';
    dbRide.startedAt = new Date();

    await this.rideRepo.save(dbRide);
    return dbRide;
  }

  // -------------------------------
  // 5️⃣ Completar viaje
  async completeRide(ride: Ride, driverRating?: number, clientRating?: number, tip?: number, useWalletForTip?: boolean): Promise<Ride> {
    const dbRide = await this.rideRepo.findOne(ride.id);
    if (!dbRide) throw new Error('Ride no encontrado');
    if (!dbRide.driver) throw new Error('Ride sin conductor');

    const config = await this.systemConfigRepo.get();
    const commissionPercent = config.commission_percentage ?? 0;

    dbRide.status = 'COMPLETED';
    dbRide.completedAt = new Date();
    dbRide.driverRating = driverRating;
    dbRide.clientRating = clientRating;
    dbRide.tip = tip;

    const total = dbRide.totalCost;
    const commission = total * (commissionPercent / 100);
    const driverNet = total - commission;

    // Creditar conductor
    await this.walletRepo.credit(dbRide.driver.id, driverNet);
    await this.walletRepo.logTransaction(dbRide.driver.id, 'RIDE_PAYMENT', driverNet);

    // Comisión plataforma
    await this.platformRepo.create({ rideId: dbRide.id, amount: commission, date: new Date() });

    // Propina
    if (tip && useWalletForTip) {
      await this.walletRepo.credit(dbRide.driver.id, tip);
      await this.walletRepo.logTransaction(dbRide.driver.id, 'TIP', tip);
    }

    // Recompensas
    await this.checkDailyReward(dbRide.driver.id);

    // Bloqueo si wallet < 0
    if ((dbRide.driver.walletBalance ?? 0) < 0) dbRide.driver.canReceiveRides = false;

    await this.rideRepo.save(dbRide);
    await this.driverRepo.save(dbRide.driver);

    return dbRide;
  }

  // -------------------------------
  // 6️⃣ Cancelar viaje
  async cancelRide(ride: Ride, userType: string): Promise<Ride> {
    const dbRide = await this.rideRepo.findOne(ride.id);
    if (!dbRide) throw new Error('Ride no encontrado');

    dbRide.status = 'CANCELLED';
    dbRide.cancelledAt = new Date();

    await this.rideRepo.save(dbRide);
    return dbRide;
  }

  // -------------------------------
  // 7️⃣ Recompensas diarias
  private async checkDailyReward(driverId: string) {
    const trips = await this.rideRepo.countCompletedTodayByDriver(driverId);
    const rewards = await this.rewardConfigRepo.findActive();

    for (const reward of rewards) {
      if (trips === reward.required_trips) {
        await this.walletRepo.credit(driverId, reward.reward_amount);
        await this.rewardLogRepo.create({ driverId, amount: reward.reward_amount, date: new Date() });
      }
    }
  }
}