import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { parseGGDriverLink } from 'z.parseGGDriverLink';

async function bootstrap() {
  // parseGGDriverLink(
  //   'https://drive.google.com/file/d/1nuA147cZdrlVrjjQNts-FhxHt6VwpD3G/view?usp=drive_link',
  // );
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: process.env.FRONTEND_DOMAIN });
  app.setGlobalPrefix('api');
  await app.listen(3001);
}
bootstrap();
