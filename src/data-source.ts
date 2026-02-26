// src/data-source.ts
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './users/user.entity';
import { Driver } from './drivers/driver.entity';
import { Wallet } from './wallet/wallet.entity';
import { Ride } from './rides/ride.entity';
import { DailyReward } from './rewards/daily-reward.entity';
import { Vehicle } from './vehicles/vehicle.entity';
import * as dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || '97011107307',
  database: process.env.DB_NAME || 'taxi_db',
  synchronize: false,
  logging: true,
  entities: [User, Driver, Wallet, Ride, DailyReward, Vehicle],
  migrations: ['./src/migrations/*.ts'],
  subscribers: [],
});