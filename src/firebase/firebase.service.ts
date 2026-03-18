import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as path from 'path';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private firebaseApp!: admin.app.App;

  onModuleInit() {
    const serviceAccount = require(
      path.join(__dirname, '../../firebase/avenzo-9701-firebase-adminsdk-fbsvc-0bd8c651cd.json')
    );

    this.firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    console.log('🔥 Firebase Admin initialized for production');
  }

  getMessaging() {
    return this.firebaseApp.messaging();
  }
}