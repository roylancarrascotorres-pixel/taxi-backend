// src/firebase/firebase.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private firebaseApp: admin.app.App;

  onModuleInit() {
    const serviceAccountJson = process.env.FIREBASE_CREDENTIAL_JSON;
    if (!serviceAccountJson) {
      throw new Error('FIREBASE_CREDENTIAL_JSON environment variable not set');
    }

    const serviceAccount = JSON.parse(serviceAccountJson);

    this.firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    console.log('🔥 Firebase Admin initialized for production');
  }

  getMessaging() {
    return this.firebaseApp.messaging();
  }
}