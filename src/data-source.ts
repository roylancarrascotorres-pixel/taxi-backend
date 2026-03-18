import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { User } from './users/user.entity';
import { Driver } from './drivers/driver.entity';
import { Wallet } from './wallet/wallet.entity';
import { Ride } from './rides/ride.entity';
import { DailyReward } from './rewards/daily-reward.entity';
import { Vehicle } from './vehicles/vehicle.entity';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,

  ssl: { rejectUnauthorized: false }, // obligatorio para Supabase

  synchronize: false, // usar solo migraciones en producción
  logging: false,

  entities: [User, Driver, Wallet, Ride, DailyReward, Vehicle],
  migrations: ['dist/migrations/*.js'],
  subscribers: [],

  extra: {
    max: 20,
    min: 2,
    idleTimeoutMillis: 30000,
  },
});