import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from './users/users.module';
import { DriversModule } from './drivers/drivers.module';
import { RidesModule } from './rides/rides.module';
import { AdminModule } from './admin/admin.module';
import { WalletsModule } from './wallet/wallets.module';
import { NotificationModule } from './notifications/notifications.module';
import { FirebaseModule } from './firebase/firebase.module';

import { HotZonesService } from './matching/hotzones.service';
import { DriverMatchingService } from './matching/driver-matching.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL, // pooler connection
      ssl: { rejectUnauthorized: false },
      autoLoadEntities: true,
      synchronize: false,
    }),

    UsersModule,
    DriversModule,
    RidesModule,
    AdminModule,
    WalletsModule,
    NotificationModule,
    FirebaseModule,
  ],
  providers: [HotZonesService, DriverMatchingService],
})
export class AppModule {}