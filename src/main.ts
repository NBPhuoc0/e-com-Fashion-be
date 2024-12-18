import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { setupSwagger } from './utils/swagger';
import cookieParser from 'cookie-parser';
import { TypeORMExceptionFilter } from './common/filters/typeorm-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.enableCors({
    origin: '*',
    credentials: false,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: false,
      transform: true,
      forbidUnknownValues: false,
      forbidNonWhitelisted: false,
      transformOptions: {
        enableImplicitConversion: true, // <- This line here
      },
      validationError: {
        target: true,
        value: true,
      },
    }),
  );
  app.use(cookieParser());

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalFilters(new TypeORMExceptionFilter());

  const logger = new Logger('Main');

  setupSwagger(app);

  await app.listen(AppModule.port);

  // log docs
  const baseUrl = AppModule.getBaseUrl(app);
  const url = `http://${baseUrl}:${AppModule.port}`;
  logger.log(`API Documentation available at ${url}`);
}
bootstrap();
