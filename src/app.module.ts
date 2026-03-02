// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Módulos
import { UsersModule } from './users/users.module';
import { DriversModule } from './drivers/drivers.module';
import { RidesModule } from './rides/rides.module';
import { WalletsModule } from './wallet/wallets.module';
import { RewardsModule } from './rewards/rewards.module';
import { AdminModule } from './admin/admin.module';
import { VehiclesModule } from './vehicles/vehicles.module';

// Entidades
import { User } from './users/user.entity';
import { Driver } from './drivers/driver.entity';
import { Ride } from './rides/ride.entity';
import { Wallet } from './wallet/wallet.entity';
import { DailyReward } from './rewards/daily-reward.entity';
import { Vehicle } from './vehicles/vehicle.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      ssl: { rejectUnauthorized: false }, // <--- Esto permite conectarse a Supabase desde Render
      entities: [User, Driver, Ride, Wallet, DailyReward, Vehicle],
      synchronize: false,
      logging: true,
    }),
    TypeOrmModule.forFeature([User, Driver, Ride, Wallet, DailyReward, Vehicle]),
    UsersModule,
    DriversModule,
    RidesModule,
    WalletsModule,
    RewardsModule,
    AdminModule,
    VehiclesModule,
  ],
})
export class AppModule {}