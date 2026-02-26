import { RideRepo } from '../src/rides/ride.repository';
import { DriverRepo, Driver } from '../src/drivers/driver.repository';
import { WalletRepo } from '../src/wallet/wallet.repository';
import { RewardConfigRepo } from '../src/rewards/reward-config.repository';
import { RewardLogRepo } from '../src/rewards/reward-log.repository';
import { PlatformEarningsRepo } from '../src/platform/platform-earnings.repository';
import { SystemConfigRepo } from '../src/system/system-config.repository';
import { NotificationService } from '../src/notifications/notification.service';
import { RidesService } from '../src/rides/rides.service';
import { calculateDistance } from '../src/utils/distance.util';

async function runAdvancedTest() {
  const rideRepo = new RideRepo();
  const driverRepo = new DriverRepo();
  const walletRepo = new WalletRepo();
  const rewardConfigRepo = new RewardConfigRepo();
  const rewardLogRepo = new RewardLogRepo();
  const platformRepo = new PlatformEarningsRepo();
  const systemConfigRepo = new SystemConfigRepo();
  const notificationService = new NotificationService();

  const ridesService = new RidesService(
    rideRepo,
    driverRepo,
    walletRepo,
    rewardConfigRepo,
    rewardLogRepo,
    platformRepo,
    systemConfigRepo,
    notificationService
  );

  // ----------------------------
  // Configuración inicial
  systemConfigRepo['config'] = {
    use_rating_rule: true,
    commission_percentage: 15,
    dynamic_pricing_enabled: true,
    grace_wait_minutes: 5,
  };

  // ----------------------------
  // Crear drivers
  const drivers: Driver[] = [
    { id: 'd1', isOnline: true, status: 'AVAILABLE', walletBalance: 0, vehicleType: 'AUTO_BASICO', rating: 5, totalTrips: 0, canReceiveRides: true, currentLat: 23.136, currentLng: -82.358 },
    { id: 'd2', isOnline: true, status: 'AVAILABLE', walletBalance: 0, vehicleType: 'AUTO_CONFORT', rating: 5, totalTrips: 0, canReceiveRides: true, currentLat: 23.140, currentLng: -82.360 },
    { id: 'd3', isOnline: true, status: 'AVAILABLE', walletBalance: 0, vehicleType: 'MOTO', rating: 5, totalTrips: 0, canReceiveRides: true, currentLat: 23.138, currentLng: -82.359 },
    { id: 'd4', isOnline: true, status: 'AVAILABLE', walletBalance: 0, vehicleType: 'XL', rating: 5, totalTrips: 0, canReceiveRides: true, currentLat: 23.139, currentLng: -82.357 },
    { id: 'd5', isOnline: true, status: 'AVAILABLE', walletBalance: 0, vehicleType: 'AUTO_BASICO', rating: 5, totalTrips: 0, canReceiveRides: true, currentLat: 23.137, currentLng: -82.356 },
  ];
  for (const d of drivers) await driverRepo.save(d);

  // ----------------------------
  // Configuración de recompensas
  rewardConfigRepo['rewards'] = [
    { required_trips: 2, reward_amount: 5, active: true },
    { required_trips: 5, reward_amount: 15, active: true },
    { required_trips: 10, reward_amount: 30, active: true },
  ];

  // ----------------------------
  // Crear clientes
  const clients = [
    { id: 'c1', wallet: 0 },
    { id: 'c2', wallet: 0 },
    { id: 'c3', wallet: 0 },
  ];

  // ----------------------------
  // Simular 200 rides
  for (let i = 0; i < 200; i++) {
    const client = clients[i % clients.length];
    const vehicleTypes = ['AUTO_BASICO','AUTO_CONFORT','MOTO','XL'];
    const vehicleType = vehicleTypes[i % vehicleTypes.length];

    const ride = await ridesService.requestRide(
      client,
      23.135 + Math.random()*0.01,
      -82.356 - Math.random()*0.01,
      23.140,
      -82.360,
      vehicleType
    );

    // Matching
    let availableDrivers = await driverRepo.findAvailable(vehicleType);
    if (availableDrivers.length === 0) {
      console.log(`No hay drivers disponibles para ride ${ride.id}`);
      continue;
    }

    // Ordenar por rating si el admin habilita
    const useRating = systemConfigRepo['config'].use_rating_rule;
    availableDrivers.sort((a,b) => {
      if (useRating && b.rating !== a.rating) return b.rating - a.rating;
      const distA = calculateDistance(ride.originLat, ride.originLng, a.currentLat!, a.currentLng!);
      const distB = calculateDistance(ride.originLat, ride.originLng, b.currentLat!, b.currentLng!);
      return distA - distB;
    });

    const driver = availableDrivers[0];

    await ridesService.acceptRide(ride, driver);
    await ridesService.startRide(ride, driver);

    // Tarifa dinámica con espera
    let baseCost = 10;
    if (systemConfigRepo['config'].dynamic_pricing_enabled) {
      const waitMinutes = Math.floor(Math.random()*10); // simula tiempo de espera
      baseCost += Math.max(waitMinutes - systemConfigRepo['config'].grace_wait_minutes, 0) * 2;
    }
    ride.totalCost = baseCost;

    // Propina aleatoria
    const tip = Math.random() > 0.5 ? Math.floor(Math.random()*5) + 1 : 0;

    await ridesService.completeRide(ride, 5, 5, tip, tip > 0);

    // Cashback al cliente (10%)
    const cashback = ride.totalCost * 0.1;
    client.wallet += cashback;

    console.log(`Ride ${ride.id} completado por driver ${driver.id}, tip $${tip}, cashback cliente $${cashback.toFixed(2)}`);
  }

  // ----------------------------
  // Reporte final
  console.log('\n=== REPORTES FINALES ===');
  let totalPlatformEarnings = 0;
  for (const d of drivers) {
    const balance = await walletRepo.getBalance(d.id);
    totalPlatformEarnings += balance;
    console.log(`Driver ${d.id}: Wallet $${balance.toFixed(2)}, rating ${d.rating}, totalTrips ${d.totalTrips}`);
  }
  for (const c of clients) console.log(`Cliente ${c.id}: Wallet $${c.wallet.toFixed(2)}`);
  console.log(`\nGanancia total aproximada de la plataforma: $${totalPlatformEarnings.toFixed(2)}`);
}

runAdvancedTest();