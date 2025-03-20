import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { BullModule } from '@nestjs/bull';

// Import modules
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
import { ObservabilityModule } from './observability/observability.module';
import { WalletModule } from './wallet/wallet.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development',
    }),
    MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://localhost/autosnipe'),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
      },
    }),
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
    ObservabilityModule,
    WalletModule,
  ],
})
export class AppModule {}
