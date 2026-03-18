import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { UsersModule } from './users/users.module';
import { DriversModule } from './drivers/drivers.module';
import { WalletsModule } from './wallet/wallets.module';
import { RidesModule } from './rides/rides.module';
import { NotificationModule } from './notifications/notifications.module';
import { AdminModule } from './admin/admin.module';
import { FirebaseService } from './firebase/firebase.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(),
    UsersModule,
    DriversModule,
    WalletsModule,
    RidesModule,
    NotificationModule,
    AdminModule
  ],
  providers: [FirebaseService]
})
export class AppModule {}