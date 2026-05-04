🛺 Avenzo Backend
<p align="center"> <img src="https://your-logo-url.com/logo.png" alt="Avenzo Logo" width="120"> </p>

Backend del sistema de transporte Avenzo, inspirado en Uber, enfocado en viajes premium en La Habana, Cuba.
Soporta clientes, choferes, administración total, wallet ficticia, penalizaciones, recompensas, zonas calientes y notificaciones push.

📦 Requisitos

Node.js ≥18

npm ≥9

PostgreSQL (Supabase u otro)

Firebase (para notificaciones push en APKs)

⚡ Instalación
git clone <repo-url>
cd taxi-backend
npm install
⚙️ Variables de entorno

Copia .env.example a .env y completa tus credenciales:

cp .env.example .env

Ejemplo (.env.example):

MAX_DRIVER_MATCH=5
DRIVER_REQUEST_TIMEOUT=15000
WAIT_TIME_FREE_MINUTES=2
WAIT_PRICE_PER_MIN=0.05
CANCEL_PENALTY=0.5
ENABLE_DRIVER_RATING=true
ARRIVAL_RADIUS_METERS=50
GPS_TOLERANCE_METERS=80
REFERRAL_REWARD=1
CITY_RADIUS_KM=40
HAVANA_LAT=23.11359
HAVANA_LNG=-82.36659

DATABASE_URL=postgresql://postgres:<tu-password>@aws-0-us-west-2.pooler.supabase.com:5432/postgres

APP_PORT=3000

⚠️ Nunca subas tu .env real al repositorio.

🚀 Scripts
# Desarrollo
npm run start

# Modo desarrollo con watch
npm run start:dev

# Producción
npm run start:prod

# Compilación
npm run build
🗂 Estructura principal

src/users → Clientes y su wallet

src/drivers → Choferes y su wallet

src/rides → Solicitud y control de viajes

src/wallet → Wallets ficticias y transacciones

src/admin → Endpoints de administración

src/matching → Hot Zones y priorización de choferes

src/notifications → Registro de tokens y envío de notificaciones push

💡 Funcionalidades
Clientes

Solicitar viajes

Pagar con wallet ficticia o en efectivo

Penalización por cancelación

Recompensas diarias o manuales por admin

Choferes

Recibir viajes solo si wallet ≥ 0

Descuento automático del % de la plataforma

Penalización por cancelación

Recompensas y bonus

Hot Zones: notificaciones push de alta demanda

Admin

Recargar wallet de clientes o choferes

Aplicar recompensas manuales

Limpiar tablas

Enviar notificaciones personalizadas a usuarios, choferes o clientes

Control total de todas las entidades (rides, wallets, users, drivers, vehicles, rewards)

🔥 Hot Zones

Calcula demanda por zona geográfica (lat/lng aproximada)

Priorización de choferes según rating y demanda

Notifica automáticamente a los 5 choferes más cercanos y con wallet ≥ 0

Incrementa la eficiencia de asignación de viajes

🔔 Notificaciones Push

Preparadas para Firebase (Android/iOS)

Permite enviar mensajes individuales o masivos

Admin puede enviar títulos y mensajes personalizados a cualquier grupo de usuarios

💳 Wallet Ficticia

Admin recarga saldo; clientes y choferes usan para solicitar o recibir viajes

Pago en efectivo: admin cobra directamente, wallet se actualiza con comisión automáticamente

Penalizaciones y bonus automáticos

🧪 Pruebas

Unitarias: npm run test

E2E: npm run test:e2e

Cobertura: npm run test:cov

📦 Deploy

Preparado para producción con APP_PORT y DATABASE_URL

Synchronize en TypeORM desactivado (synchronize: false)

Preparado para ser subido a GitHub o desplegado en un VPS/Cloud

🔗 Firebase y APKs

Crear APKs de Cliente, Chofer y Admin.

Descargar google-services.json o GoogleService-Info.plist para cada APK.

Colocar los archivos en src/firebase/ y registrar tokens de dispositivo desde las apps.

Las notificaciones push se enviarán usando NotificationService.

📝 License

Copyright (c) 2026 Roylan Carrasco Torres
Todos los derechos reservados.

Este software y su código fuente son propietarios.
Ninguna parte de este software puede ser utilizada, copiada, modificada, fusionada, publicada, distribuida, sublicenciada o vendida sin el permiso explícito del autor.
