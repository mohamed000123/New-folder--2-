import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { NextFunction, Request, Response } from 'express';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { markApiRequestStart } from './common/helpers/api-request.helper';
import { ApiLoggingInterceptor } from './common/interceptors/api-logging.interceptor';
import { appValidationPipe } from './common/pipes/validation.pipe';

function getCorsOrigins(): string | string[] {
  const configuredOrigin = process.env.CORS_ORIGIN ?? 'http://localhost:3000';
  const origins = configuredOrigin
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  return origins.length > 1 ? origins : origins[0] ?? configuredOrigin;
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Hotel Booking API')
    .setDescription('REST API for hotels, rooms, bookings, and payments')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);
  app.enableCors({
    origin: getCorsOrigins(),
    credentials: true,
  });
  app.use(cookieParser());
  app.use((request: Request, _response: Response, next: NextFunction) => {
    markApiRequestStart(request);
    next();
  });
  app.useGlobalPipes(appValidationPipe);
  app.useGlobalInterceptors(new ApiLoggingInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
}

bootstrap();
