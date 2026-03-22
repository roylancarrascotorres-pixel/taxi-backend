import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { getApps, getApp, messaging } from 'firebase-admin/app';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private firebaseApp: admin.app.App;

  onModuleInit() {
    try {
      // Si ya hay apps inicializadas, reutiliza
      this.firebaseApp = getApps().length ? getApp() : admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
      });

      console.log('🔥 Firebase conectado correctamente');
    } catch (error) {
      console.error('Error inicializando Firebase', error);
    }
  }

  getMessaging(): admin.messaging.Messaging {
    return this.firebaseApp.messaging();
  }
}