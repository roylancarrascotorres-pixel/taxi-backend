import { Module } from '@nestjs/common';
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
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'db.htawzwkztxtssvsxrzdu.supabase.co', // Host de Supabase
      port: 5432,                                   // Puerto PostgreSQL
      username: 'postgres',                         // Usuario Supabase
      password: 'k8kFeuEUNsxxENVm',            // Contraseña segura de Supabase
      database: 'postgres',                         // Base de datos que creaste en Supabase
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,                            // True solo en desarrollo
      logging: false,
    }),
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