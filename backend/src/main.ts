// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import * as helmet from 'helmet';
import * as rateLimit from 'express-rate-limit';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Global Input Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Global Error Handling & Logging
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());

  // Security Enhancements

  // Use Helmet to secure HTTP headers
  app.use(helmet.default());

  // Rate limiting middleware: limit each IP to 100 requests per 15 minutes
  app.use(
    rateLimit.default({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100,
    }),
  );

  // Enable CORS: specify allowed origins via environment variable, e.g., ALLOWED_ORIGINS= https://yourdomain.com,https://anotherdomain.com
  const allowedOrigins = configService.get<string>('ALLOWED_ORIGINS')?.split(',') || ['*'];
  app.enableCors({
    origin: allowedOrigins,
  });

  // Optionally, if you want to force HTTPS in your NestJS app (not common in production as a reverse proxy usually handles it)
  // app.use((req, res, next) => {
  //   if (req.headers['x-forwarded-proto'] !== 'https') {
  //     return res.redirect('https://' + req.headers.host + req.url);
  //   }
  //   next();
  // });

  const port = configService.get<number>('PORT') || 3000;
  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
