import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import * as admin from 'firebase-admin';

@Injectable()
export class NotificationService {
  constructor(private readonly firebaseService: FirebaseService) {}

  async sendToDevice(token: string, title: string, body: string, data?: Record<string, string>) {
    const message: admin.messaging.Message = {
      token,
      notification: { title, body },
      data,
    };

    return await this.firebaseService.getMessaging().send(message);
  }

  async sendToMultipleDevices(tokens: string[], title: string, body: string, data?: Record<string, string>) {
    const message: admin.messaging.MulticastMessage = {
      tokens,
      notification: { title, body },
      data,
    };

    return await this.firebaseService.getMessaging().sendMulticast(message);
  }
}