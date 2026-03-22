import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import * as admin from 'firebase-admin';

@Injectable()
export class NotificationService {
  private userTokens: Map<string, string> = new Map(); // Ejemplo simple para token

  constructor(private readonly firebaseService: FirebaseService) {}

  // Registrar token de un usuario
  async registerToken(userId: string, token: string) {
    this.userTokens.set(userId, token);
    console.log(`Token registrado para usuario ${userId}`);
  }

  // Enviar notificación a un usuario
  async sendToUser(userId: string, title: string, body: string, data?: Record<string, string>) {
    const token = this.userTokens.get(userId);
    if (!token) return console.warn('Usuario sin token', userId);

    const message: admin.messaging.Message = { token, notification: { title, body }, data };
    return await this.firebaseService.getMessaging().send(message);
  }

  // Enviar notificación a todos los conductores (simulado)
  async sendToAllDrivers(title: string, body: string) {
    const tokens = Array.from(this.userTokens.values()); // reemplaza con tus tokens de drivers
    const message: admin.messaging.MulticastMessage = { tokens, notification: { title, body } };
    return await this.firebaseService.getMessaging().sendMulticast(message);
  }

  // Enviar notificación a todos los clientes (simulado)
  async sendToAllClients(title: string, body: string) {
    const tokens = Array.from(this.userTokens.values()); // reemplaza con tus tokens de clientes
    const message: admin.messaging.MulticastMessage = { tokens, notification: { title, body } };
    return await this.firebaseService.getMessaging().sendMulticast(message);
  }

  // Enviar push genérico (puede usarse para cualquier token)
  async sendPush(token: string, title: string, body: string, data?: Record<string, string>) {
    const message: admin.messaging.Message = { token, notification: { title, body }, data };
    return await this.firebaseService.getMessaging().send(message);
  }

  // Enviar notificación a múltiples tokens
  async sendMulticast(message: admin.messaging.MulticastMessage) {
    return await this.firebaseService.getMessaging().sendMulticast(message);
  }
}