import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Bank CRUD API')
    .setDescription('The API description')
    .setVersion('1.0')
    .addTag('api')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: { filter: true, showRequestDuration: true },
    customSiteTitle: 'My API Docs',
  });

  await app
    .useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))
    .listen(3000);
}
bootstrap();
