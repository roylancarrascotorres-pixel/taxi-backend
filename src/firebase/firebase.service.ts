import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private firebaseApp!: admin.app.App;

  onModuleInit() {
    // Tomamos la variable de entorno y la convertimos a objeto JSON
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}');

    this.firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    console.log('🔥 Firebase Admin initialized with environment variable');
  }

  getMessaging() {
    return this.firebaseApp.messaging();
  }
}