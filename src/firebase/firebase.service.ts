import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private app!: admin.app.App; // Se inicializa en onModuleInit

  onModuleInit() {
    const firebaseCredentialsJson = process.env.FIREBASE_CREDENTIAL_JSON;
    if (!firebaseCredentialsJson) {
      throw new Error('FIREBASE_CREDENTIAL_JSON no está definida en el .env');
    }

    const firebaseCredentials = JSON.parse(firebaseCredentialsJson);

    this.app = admin.initializeApp({
      credential: admin.credential.cert(firebaseCredentials),
    });
  }

  // Método para obtener Messaging de Firebase
  getMessaging() {
    return this.app.messaging();
  }
}