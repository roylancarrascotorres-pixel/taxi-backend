// src/rides/rides.service.ts
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Ride } from './ride.entity';
import { Wallet } from '../wallet/wallet.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { HotZonesService } from '../matching/hotzones.service';
import { WalletsService } from '../wallet/wallets.service';
import { Driver } from '../drivers/driver.entity';
import { NotificationService } from '../notifications/notification.service';
import { WalletTransactionType } from '../wallet/wallet-transaction.entity';

@Injectable()
export class RideService {
  constructor(
    @InjectRepository(Ride)
    private readonly rideRepo: Repository<Ride>,
    @InjectRepository(Wallet)
    private readonly walletRepo: Repository<Wallet>,
    private readonly hotZonesService: HotZonesService,
    private readonly walletsService: WalletsService,
    private readonly notificationService: NotificationService,
  ) {}

  async requestRide(
    clientId: number,
    pickupLat: number,
    pickupLng: number,
    dropLat: number,
    dropLng: number,
    vehicleTypeId: number,
    drivers: Driver[],
  ): Promise<Ride> {
    const availableDrivers = drivers.filter(
      d => d.wallet.balance >= 0 && d.available && !d.suspended,
    );
    if (availableDrivers.length === 0) throw new Error('No drivers available');

    const ride = this.rideRepo.create({
      client: { id: clientId } as any,
      originLat: pickupLat,
      originLng: pickupLng,
      destLat: dropLat,
      destLng: dropLng,
      vehicleType: vehicleTypeId.toString(),
      status: 'requested',
    });

    this.hotZonesService.registerRide(ride);
    const savedRide = await this.rideRepo.save(ride);

    await this.assignRideToTopDrivers(savedRide, availableDrivers);

    return savedRide;
  }

  private async assignRideToTopDrivers(ride: Ride, drivers: Driver[]): Promise<void> {
    const remainingDrivers = [...drivers];

    while (remainingDrivers.length > 0 && !ride.driver) {
      const topDrivers = this.hotZonesService.prioritizeDrivers(remainingDrivers, ride);
      if (topDrivers.length === 0) break;

      const driverPromises: { driver: Driver; promise: Promise<Driver | null>; resolve: (v: Driver | null) => void; timeout: NodeJS.Timeout }[] = [];

      for (const d of topDrivers) {
        let resolver!: (v: Driver | null) => void;
        const p = new Promise<Driver | null>(resolve => (resolver = resolve));
        const timeout = setTimeout(() => resolver(null), 15000);

        this.notificationService
          .sendToUser(d.id, 'Viaje disponible cerca de ti', 'Hay un cliente solicitando viaje en tu zona.')
          .catch(err => console.error('Error notificando driver', d.id, err));

        driverPromises.push({ driver: d, promise: p, resolve: resolver, timeout });
      }

      ride.driverPromises = driverPromises; // inicializamos la propiedad

      try {
        const acceptedDriver = await Promise.any(driverPromises.map(p => p.promise));
        if (acceptedDriver) {
          ride.driver = acceptedDriver;
          ride.status = 'accepted';
          acceptedDriver.available = false;
          await this.rideRepo.save(ride);

          driverPromises.forEach(p => {
            if (p.driver.id !== acceptedDriver.id) {
              p.resolve(null);
              clearTimeout(p.timeout);
            } else clearTimeout(p.timeout);
          });

          await this.notificationService.sendToUser(
            ride.client.id,
            'Chofer asignado',
            `Tu chofer ${acceptedDriver.name} está en camino.`,
          );
          break;
        }
      } catch {
        console.log('Ningún driver de esta tanda aceptó, reasignando...');
      }

      for (const d of topDrivers) {
        const index = remainingDrivers.findIndex(r => r.id === d.id);
        if (index !== -1) remainingDrivers.splice(index, 1);
      }
    }

    if (!ride.driver) console.log('Ningún driver aceptó el viaje después de reasignaciones');
  }

  async acceptRide(rideId: number, driverId: number): Promise<Ride> {
    return this.rideRepo.manager.transaction(async manager => {
      const ride = await manager.findOne(Ride, {
        where: { id: rideId },
        relations: ['client', 'driver'],
        lock: { mode: 'pessimistic_write' },
      });

      if (!ride) throw new Error('Ride not found');
      if (ride.status !== 'requested') throw new Error('Ride already taken');

      const driverPromiseEntry = ride.driverPromises?.find(p => p.driver.id === driverId);
      if (!driverPromiseEntry) throw new Error('Driver not in current top drivers or timeout expired');

      ride.driver = driverPromiseEntry.driver;
      ride.status = 'accepted';
      ride.driver.available = false;

      await manager.save(ride);

      driverPromiseEntry.resolve(driverPromiseEntry.driver);
      clearTimeout(driverPromiseEntry.timeout);
      ride.driverPromises?.forEach(p => {
        if (p.driver.id !== driverId) {
          p.resolve(null);
          clearTimeout(p.timeout);
        }
      });

      await this.notificationService.sendToUser(
        ride.client.id,
        'Chofer asignado',
        `Tu chofer ${ride.driver.name} está en camino.`,
      );

      return ride;
    });
  }

  async completeTrip(rideId: number, payWithWallet = false, platformPercent = 10): Promise<Ride | null> {
    const ride = await this.rideRepo.findOne({ where: { id: rideId }, relations: ['client', 'driver'] });
    if (!ride) return null;

    ride.status = 'completed';
    ride.completedAt = new Date();
    const price = 5;
    ride.totalCost = price;

    ride.driver.available = true;

    if (payWithWallet && ride.client.wallet && ride.driver.wallet) {
      await this.walletsService.applyTransaction(ride.client.wallet.id, -price, WalletTransactionType.RIDE_PAYMENT, ride.id.toString());
      const netDriver = price * (1 - platformPercent / 100);
      await this.walletsService.applyTransaction(ride.driver.wallet.id, netDriver, WalletTransactionType.DRIVER_EARNING, ride.id.toString());
    }

    return this.rideRepo.save(ride);
  }

  async cancelRide(rideId: number, cancelBy: 'client' | 'driver', penalty = 0): Promise<Ride | null> {
    const ride = await this.rideRepo.findOne({ where: { id: rideId }, relations: ['client', 'driver'] });
    if (!ride) return null;

    ride.status = 'cancelled';
    ride.cancelledAt = new Date();
    ride.driver.available = true;

    if (penalty > 0 && ride.client.wallet && ride.driver.wallet) {
      if (cancelBy === 'client') {
        await this.walletsService.applyTransaction(ride.client.wallet.id, -penalty, WalletTransactionType.PENALTY, ride.id.toString());
        await this.walletsService.applyTransaction(ride.driver.wallet.id, penalty, WalletTransactionType.BONUS, ride.id.toString());
      } else {
        await this.walletsService.applyTransaction(ride.driver.wallet.id, -penalty, WalletTransactionType.PENALTY, ride.id.toString());
        await this.walletsService.applyTransaction(ride.client.wallet.id, penalty, WalletTransactionType.BONUS, ride.id.toString());
      }
    }

    return this.rideRepo.save(ride);
  }
}