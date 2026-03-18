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

  host: process.env.DB_HOST || 'aws-0-us-west-2.pooler.supabase.com',
  port: parseInt(process.env.DB_PORT || '6543', 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME || 'postgres',

  ssl: {
    rejectUnauthorized: false, // obligatorio en Supabase
  },

  synchronize: false, // en producción se recomienda usar migraciones
  logging: false,     // evita llenar logs en producción

  entities: [User, Driver, Wallet, Ride, DailyReward, Vehicle],

  migrations: ['dist/migrations/*.js'],
  subscribers: [],

  // 🔹 Pool de conexiones para producción
  extra: {
    max: 20,                // máximo 20 conexiones abiertas
    min: 2,                 // mínimo 2 conexiones abiertas
    idleTimeoutMillis: 30000 // cerrar conexiones inactivas después de 30s
  },
});