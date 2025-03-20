import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import * as helmet from 'helmet';
import * as rateLimit from 'express-rate-limit';
import { ConfigService } from '@nestjs/config';
import * as client from 'prom-client';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());

  app.use(helmet.default());
  app.use(rateLimit.default({
    windowMs: 15 * 60 * 1000,
    max: 100,
  }));
console.log(configService.get<string>('ALLOWED_ORIGINS'))
  const allowedOrigins = configService.get<string>('ALLOWED_ORIGINS')?.split(',') || ['*'];
  app.enableCors({ origin: allowedOrigins });

  // Clear default metrics and collect default metrics once.
  client.register.clear();
  client.collectDefaultMetrics();

  const port = configService.get<number>('PORT') || 8000;
  await app.listen(port);
  console.log(`Application running on: ${await app.getUrl()}`);
}
bootstrap();
