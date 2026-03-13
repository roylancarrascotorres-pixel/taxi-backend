// src/firebase/firebase.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common'
import * as admin from 'firebase-admin'
import * as path from 'path'

@Injectable()
export class FirebaseService implements OnModuleInit {

  private firebaseApp: admin.app.App

  onModuleInit() {
    // Ruta absoluta hacia el JSON de producción dentro de dist/firebase
    const serviceAccountPath = path.join(process.cwd(), 'dist/firebase/admin-firebase.json')
    
    const serviceAccount = require(serviceAccountPath)

    this.firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    })

    console.log('🔥 Firebase initialized (Production)')
  }

  getMessaging() {
    return this.firebaseApp.messaging()
  }
}