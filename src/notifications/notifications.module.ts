// src/notifications/notification.module.ts
import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { FirebaseModule } from '../firebase/firebase.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.entity';

@Module({
  imports: [
    FirebaseModule,
    TypeOrmModule.forFeature([User])
  ],
  providers: [NotificationService],
  controllers: [NotificationController],
  exports: [NotificationService]
})
export class NotificationModule {}