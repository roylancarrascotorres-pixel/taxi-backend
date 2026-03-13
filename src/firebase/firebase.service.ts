import { Injectable, OnModuleInit } from '@nestjs/common'
import * as admin from 'firebase-admin'
import * as path from 'path'

@Injectable()
export class FirebaseService implements OnModuleInit {

  private firebaseApp: admin.app.App

  onModuleInit() {

    const serviceAccount = require(
      path.join(__dirname, '../../firebase/admin-firebase.json')
    )

    this.firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    })

    console.log('🔥 Firebase initialized')
  }

  getMessaging() {
    return this.firebaseApp.messaging()
  }

}