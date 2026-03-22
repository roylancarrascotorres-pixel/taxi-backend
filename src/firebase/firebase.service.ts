// src/firebase/firebase.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { getApps, getApp, initializeApp, applicationDefault, messaging } from 'firebase-admin/app';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private firebaseApp: admin.app.App;

  onModuleInit() {
    // Evitar inicializar Firebase más de una vez
    this.firebaseApp = getApps().length ? getApp() : admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
    console.log('🔥 Firebase conectado correctamente');
  }

  getMessaging(): admin.messaging.Messaging {
    return this.firebaseApp.messaging();
  }
}