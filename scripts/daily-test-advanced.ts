import { RideRepo } from '../rides/ride.repository';
import { DriverRepo, Driver } from '../drivers/driver.repository';
import { WalletRepo } from '../wallet/wallet.repository';
import { RewardConfigRepo, RewardConfig } from '../rewards/reward-config.repository';
import { RewardLogRepo } from '../rewards/reward-log.repository';
import { PlatformEarningsRepo } from '../platform/platform-earnings.repository';
import { SystemConfigRepo } from '../system/system-config.repository';
import { NotificationService } from '../notifications/notification.service';
import { RidesService } from '../rides/rides.service';

async function runTest() {
  // 🔹 Inicializar repositorios
  const rideRepo = new RideRepo();
  const driverRepo = new DriverRepo();
  const driverWallet = new WalletRepo();
  const rewardConfigRepo = new RewardConfigRepo();
  const rewardLogRepo = new RewardLogRepo();
  const platformEarningsRepo = new PlatformEarningsRepo();
  const systemConfigRepo = new SystemConfigRepo();
  const notificationService = new NotificationService();

  // 🔹 Inicializar servicio de rides
  const ridesService = new RidesService(
    rideRepo,
    driverRepo,
    driverWallet,
    rewardConfigRepo,
    rewardLogRepo,
    platformEarningsRepo,
    systemConfigRepo,
    notificationService
  );

  // 🔹 Crear drivers de prueba
  const drivers: Driver[] = [
    { id: 'd1', isOnline: true, status: 'AVAILABLE', walletBalance: 0, vehicleType: 'car', rating: 5, totalTrips: 0, canReceiveRides: true },
    { id: 'd2', isOnline: true, status: 'AVAILABLE', walletBalance: 0, vehicleType: 'car', rating: 5, totalTrips: 0, canReceiveRides: true },
    { id: 'd3', isOnline: true, status: 'AVAILABLE', walletBalance: 0, vehicleType: 'car', rating: 5, totalTrips: 0, canReceiveRides: true },
    { id: 'd4', isOnline: true, status: 'AVAILABLE', walletBalance: 0, vehicleType: 'car', rating: 5, totalTrips: 0, canReceiveRides: true },
    { id: 'd5', isOnline: true, status: 'AVAILABLE', walletBalance: 0, vehicleType: 'car', rating: 5, totalTrips: 0, canReceiveRides: true },
  ];

  for (const d of drivers) {
    await driverRepo.save(d);
  }

  // 🔹 Crear rides de prueba
  const ridesData = [
    { client: { id: 'c1' }, originLat: 10, originLng: 10, destLat: 15, destLng: 15, vehicleType: 'car', totalCost: 10, tip: 0 },
    { client: { id: 'c2' }, originLat: 20, originLng: 20, destLat: 25, destLng: 25, vehicleType: 'car', totalCost: 20, tip: 0 },
    { client: { id: 'c3' }, originLat: 30, originLng: 30, destLat: 35, destLng: 35, vehicleType: 'car', totalCost: 30, tip: 5 },
  ];

  const rides = [];
  for (const data of ridesData) {
    const ride = await ridesService.requestRide(
      data.client,
      data.originLat,
      data.originLng,
      data.destLat,
      data.destLng,
      data.vehicleType
    );
    ride.totalCost = data.totalCost;
    ride.tip = data.tip;
    await rideRepo.save(ride);
    rides.push(ride);
  }

  // 🔹 Simular completado de rides
  for (const ride of rides) {
    const availableDrivers = (await driverRepo.findAvailable(ride.vehicleType)).slice(0, 1);
    if (availableDrivers.length === 0) {
      console.log(`No hay drivers disponibles para ride ${ride.id}`);
      continue;
    }
    const driver = availableDrivers[0];

    await ridesService.acceptRide(ride, driver);
    await ridesService.startRide(ride, driver);
    await ridesService.completeRide(ride, 5, 5, ride.tip, true);

    console.log(`Ride ${ride.id} completado por driver ${driver.id}, tip $${ride.tip}, cashback cliente $${ride.promotionPercent ?? 0}`);
  }

  // 🔹 Reporte final
  for (const d of drivers) {
    console.log(`Driver ${d.id}: Wallet $${await driverWallet.getBalance(d.id)}, rating ${d.rating}, totalTrips ${d.totalTrips}`);
  }
  for (const c of ['c1', 'c2', 'c3']) {
    console.log(`Cliente ${c}: Wallet $${await driverWallet.getBalance(c)}`);
  }

  const totalEarnings = platformEarningsRepo['earnings'].reduce((acc, e) => acc + e.amount, 0);
  console.log(`\nGanancia total aproximada de la plataforma: $${totalEarnings}`);
}

runTest().catch(console.error);