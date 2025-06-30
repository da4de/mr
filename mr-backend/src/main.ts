import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { WsAdapter } from '@nestjs/platform-ws';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  
  app.enableCors({
    origin: configService.get<string>('allowedOrigins') || '',
  })

  app.useGlobalPipes(
    new ValidationPipe({ transform: true })
  )

  app.useWebSocketAdapter(new WsAdapter(app));

  const port = configService.get<string>('port');
  if (!port) {
    throw new Error('ConfigService: Missing required config: "Port"')
  }

  await app.listen(port, '0.0.0.0');
}
bootstrap();
