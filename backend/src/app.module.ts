// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

// Import all other modules...
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TokenModule } from './token/token.module';
import { TradingModule } from './trading/trading.module';
import { NotificationsModule } from './notifications/notifications.module';
import { SniperModule } from './sniper/sniper.module';
import { CopyTradingModule } from './copy-trading/copy-trading.module';
import { SentimentModule } from './sentiment/sentiment.module';
import { RiskManagementModule } from './risk-management/risk-management.module';
import { MultiChainModule } from './multi-chain/multi-chain.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { AlertsModule } from './alerts/alerts.module';
import { BullModule } from '@nestjs/bull';
// Import Observability Module
import { ObservabilityModule } from './observability/observability.module';
import { WalletModule } from './wallet/wallet.module';
import { TokenMonitoringService } from './token/token-monitoring.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development',
    }),
    MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://localhost/autosnipe'),
    AuthModule,
    UserModule,
    TokenModule,
    TradingModule,
    NotificationsModule,
    SniperModule,
    CopyTradingModule,
    SentimentModule,
    RiskManagementModule,
    MultiChainModule,
    AnalyticsModule,
    AlertsModule,
    ObservabilityModule, 
    WalletModule,
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379', 10) || 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'token-monitoring',
    }),
  ],
  controllers: [],
  providers: [TokenMonitoringService],
})
export class AppModule {}
