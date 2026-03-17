import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { DriversModule } from './drivers/drivers.module';
import { RidesModule } from './rides/rides.module';
import { AdminModule } from './admin/admin.module';
import { HotZonesService } from './matching/hotzones.service';
import { DriverMatchingService } from './matching/driver-matching.service';
import { FirebaseModule } from './firebase/firebase.module';
import { NotificationModule } from './notifications/notifications.module';
import { WalletsModule } from './wallet/wallets.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }, // obligatorio para Supabase
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