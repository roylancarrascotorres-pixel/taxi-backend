import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService implements OnModuleInit {
  onModuleInit() {
    if (!admin.apps.length) {
      const firebaseCredentials = JSON.parse(process.env.FIREBASE_CREDENTIAL_JSON);

      admin.initializeApp({
        credential: admin.credential.cert(firebaseCredentials),
      });

      console.log('Firebase initialized successfully ✅');
    }
  }
}