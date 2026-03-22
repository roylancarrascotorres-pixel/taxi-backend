import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private app: admin.app.App;

  onModuleInit() {
    const firebaseCredentialsStr = process.env.FIREBASE_CREDENTIAL_JSON;
    if (!firebaseCredentialsStr) {
      throw new Error('FIREBASE_CREDENTIAL_JSON not defined in .env');
    }

    const firebaseCredentials = JSON.parse(firebaseCredentialsStr);

    this.app = admin.initializeApp({
      credential: admin.credential.cert(firebaseCredentials),
    });
  }

  // Retorna el Messaging de Firebase
  getMessaging(): admin.messaging.Messaging {
    if (!this.app) {
      throw new Error('Firebase not initialized');
    }
    return this.app.messaging();
  }
}