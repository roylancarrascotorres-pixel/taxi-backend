// src/notifications/notification.service.ts
import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { MessagingPayload, MulticastMessage } from 'firebase-admin/lib/messaging';

@Injectable()
export class NotificationService {
  constructor(private readonly firebaseService: FirebaseService) {}

  async registerToken(userId: string, token: string) {
    // Aquí deberías guardar el token en la DB relacionado al userId
    console.log(`Registrando token para userId ${userId}: ${token}`);
  }

  async sendToUser(userId: string, title: string, message: string) {
    // Obtener tokens del usuario desde DB
    const tokens = await this.getUserTokens(userId);
    if (!tokens || tokens.length === 0) return;

    const payload: MulticastMessage = {
      tokens,
      notification: { title, body: message },
    };

    await this.sendMulticast(payload);
  }

  async sendToAllDrivers(title: string, message: string) {
    const tokens = await this.getAllDriverTokens();
    if (!tokens || tokens.length === 0) return;

    const payload: MulticastMessage = {
      tokens,
      notification: { title, body: message },
    };

    await this.sendMulticast(payload);
  }

  async sendToAllClients(title: string, message: string) {
    const tokens = await this.getAllClientTokens();
    if (!tokens || tokens.length === 0) return;

    const payload: MulticastMessage = {
      tokens,
      notification: { title, body: message },
    };

    await this.sendMulticast(payload);
  }

  async sendPush(token: string, title: string, message: string) {
    const payload: MessagingPayload = {
      notification: { title, body: message },
    };
    await this.firebaseService.getMessaging().send({ token, ...payload });
  }

  private async sendMulticast(payload: MulticastMessage) {
    const messaging = this.firebaseService.getMessaging();
    await messaging.sendMulticast(payload);
  }

  // Simulaciones de obtención de tokens desde la DB
  private async getUserTokens(userId: string): Promise<string[]> {
    return ['token1', 'token2']; // reemplazar con DB real
  }

  private async getAllDriverTokens(): Promise<string[]> {
    return ['driverToken1', 'driverToken2'];
  }

  private async getAllClientTokens(): Promise<string[]> {
    return ['clientToken1', 'clientToken2'];
  }
}