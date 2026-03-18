import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { DriversModule } from './drivers/drivers.module';
import { WalletsModule } from './wallet/wallets.module';
import { RidesModule } from './rides/rides.module';
import { AdminModule } from './admin/admin.module';
import { NotificationModule } from './notifications/notifications.module';
import { FirebaseModule } from './firebase/firebase.module';
import { DailyReward } from './rewards/daily-reward.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT!,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false,
      ssl: { rejectUnauthorized: false },
    }),
    UsersModule,
    DriversModule,
    WalletsModule,
    RidesModule,
    AdminModule,
    NotificationModule,
    FirebaseModule,
  ],
})
export class AppModule {}