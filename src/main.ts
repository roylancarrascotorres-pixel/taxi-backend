import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'], // mínimo para producción
  });

  // Valida automáticamente DTOs en las requests
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));

  // Puerto dinámico: Render asigna PORT automáticamente
  const port = process.env.PORT || 3000;

  await app.listen(port);
  Logger.log(`🚀 Server running on port ${port}`, 'Bootstrap');
}

bootstrap();