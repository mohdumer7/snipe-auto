import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SniperService } from './sniper/sniper.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);

  // Simulate running sniper bots every 10 seconds
  const sniperService = app.get(SniperService);
  setInterval(() => {
    sniperService.runSniperBots();
  }, 10000);
}
bootstrap();
