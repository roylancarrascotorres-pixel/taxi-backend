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
      host: 'db.htawzwkztxtssvsxrzdu.supabase.co',
      port: 5432,
      username: 'postgres',              // Usuario de Supabase
      password: 'k8kFeueUNsxxENVm',      // Contraseña segura de Supabase
      database: 'taxi-db',               // Nombre de la base de datos en Supabase
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,                 // TRUE solo para desarrollo, en producción es mejor false
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