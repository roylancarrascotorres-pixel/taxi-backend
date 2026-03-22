import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private firebaseApp: admin.app.App;

  onModuleInit() {
    if (!process.env.FIREBASE_CREDENTIAL_JSON) {
      throw new Error('FIREBASE_CREDENTIAL_JSON no está definido en las variables de entorno');
    }

    const serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIAL_JSON);
    serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');

    // Verifica si ya existe un app inicializado
    this.firebaseApp = admin.apps.length
      ? admin.app() // reutiliza el app existente
      : admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
        });

    console.log('🔥 Firebase conectado correctamente');
  }

  getMessaging(): admin.messaging.Messaging {
    return this.firebaseApp.messaging();
  }
}