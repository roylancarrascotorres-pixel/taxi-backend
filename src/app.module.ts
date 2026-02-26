import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RidesModule } from './rides/rides.module';
import { DriversModule } from './drivers/drivers.module';
import { WalletsModule } from './wallet/wallets.module';
import { RewardsModule } from './rewards/rewards.module';
import { PlatformModule } from './platform/platform.module';
import { SystemModule } from './system/system.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    // ConfigModule para leer .env
    ConfigModule.forRoot({
      isGlobal: true, // disponible en toda la app
    }),

    // TypeORM con variables de entorno
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: 'db.htawzwkztxtssvsxrzdu.supabase.co',
        port: '5432',
        username: 'postgres',
        password: 'k8kFeuEUNsxxENVm',
        database: 'taxi-db',
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true, // true solo desarrollo, en prod usar false
        logging: false,
      }),
    }),

    // Tus módulos
    RidesModule,
    DriversModule,
    WalletsModule,
    RewardsModule,
    PlatformModule,
    SystemModule,
    NotificationsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}