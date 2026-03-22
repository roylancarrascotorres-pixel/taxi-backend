import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private firebaseApp: admin.app.App;

  onModuleInit() {
    // 🔥 Parsear JSON desde variable de entorno
    const serviceAccount = JSON.parse(
      process.env.FIREBASE_CREDENTIAL_JSON as string,
    );

    // 🔥 Arreglar saltos de línea del private_key
    serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');

    // 🔥 Inicializar Firebase
    this.firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    console.log('🔥 Firebase conectado correctamente');
  }

  // 🔔 Enviar notificación a un token
  async sendNotification(token: string, title: string, body: string) {
    return admin.messaging().send({
      token,
      notification: {
        title,
        body,
      },
    });
  }

  // 🔔 Enviar a múltiples tokens
  async sendMulticast(tokens: string[], title: string, body: string) {
    return admin.messaging().sendMulticast({
      tokens,
      notification: {
        title,
        body,
      },
    });
  }
}