import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';

@Injectable()
export class NotificationService {
  constructor(
    private firebaseService: FirebaseService,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async registerToken(userId: number, token: string) {
    await this.userRepo.update(userId, { fcmToken: token });
  }

  async sendPush(token: string, title: string, body: string) {
    const message = {
      token,
      notification: { title, body },
      data: { click_action: 'FLUTTER_NOTIFICATION_CLICK' },
    };
    return await this.firebaseService.getMessaging().send(message);
  }

  async sendToUser(userId: number, title: string, message: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user?.fcmToken) return;
    return this.sendPush(user.fcmToken, title, message);
  }

  async sendToAllDrivers(title: string, message: string) {
    const drivers = await this.userRepo.find({ where: { role: 'driver' } });
    const tokens = drivers.map((d) => d.fcmToken!).filter(Boolean);
    if (tokens.length === 0) return;
    return this.sendToMany(tokens, title, message);
  }

  async sendToAllClients(title: string, message: string) {
    const clients = await this.userRepo.find({ where: { role: 'client' } });
    const tokens = clients.map((c) => c.fcmToken!).filter(Boolean);
    if (tokens.length === 0) return;
    return this.sendToMany(tokens, title, message);
  }

  async sendToMany(tokens: string[], title: string, body: string) {
    const message = {
      tokens,
      notification: { title, body },
      data: { click_action: 'FLUTTER_NOTIFICATION_CLICK' },
    };
    return await this.firebaseService.getMessaging().sendEachForMulticast(message);
  }
}