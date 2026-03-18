import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { DriversModule } from './drivers/drivers.module';
import { RidesModule } from './rides/rides.module';
import { AdminModule } from './admin/admin.module';
import { FirebaseModule } from './firebase/firebase.module';
import { NotificationModule } from './notifications/notifications.module';
import { WalletsModule } from './wallet/wallets.module';
import { HotZonesService } from './matching/hotzones.service';
import { DriverMatchingService } from './matching/driver-matching.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      ssl: { rejectUnauthorized: false },
      autoLoadEntities: true,
      synchronize: false,
    }),
    UsersModule,
    DriversModule,
    RidesModule,
    AdminModule,
    FirebaseModule,
    NotificationModule,
    WalletsModule,
  ],
  providers: [HotZonesService, DriverMatchingService],
})
export class AppModule {}