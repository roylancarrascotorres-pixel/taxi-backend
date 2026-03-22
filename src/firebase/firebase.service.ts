import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private firebaseApp!: admin.app.App;

  onModuleInit() {
    if (!process.env.FIREBASE_CREDENTIAL_JSON) {
      throw new Error('La variable de entorno FIREBASE_CREDENTIAL_JSON no está definida');
    }

    // Parseamos el JSON desde la variable de entorno
    const serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIAL_JSON);

    this.firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    console.log('🔥 Firebase Admin inicializado correctamente');
  }

  getMessaging() {
    return this.firebaseApp.messaging();
  }
}