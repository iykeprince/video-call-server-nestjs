import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SocketIOAdapter } from './socket-io-adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({whitelist: true}))
  const configService = app.get(ConfigService)
  app.useWebSocketAdapter(new SocketIOAdapter(app, configService))
  await app.listen(process.env.PORT || 6000);
}
bootstrap();
