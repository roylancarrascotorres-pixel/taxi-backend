import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private firebaseApp!: admin.app.App; // 🔥 FIX 1

  onModuleInit() {
    const serviceAccount = JSON.parse(
      process.env.FIREBASE_CREDENTIAL_JSON as string,
    );

    serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');

    this.firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    console.log('🔥 Firebase conectado correctamente');
  }

  // 🔥 NUEVO: obtener messaging (FIX 3)
  getMessaging() {
    return admin.messaging();
  }

  // 🔔 Enviar a un solo token
  async sendNotification(token: string, title: string, body: string) {
    return admin.messaging().send({
      token,
      notification: {
        title,
        body,
      },
    });
  }

  // 🔔 Enviar a múltiples tokens (FIX 2)
  async sendMulticast(tokens: string[], title: string, body: string) {
    return admin.messaging().sendEachForMulticast({
      tokens,
      notification: {
        title,
        body,
      },
    });
  }
}