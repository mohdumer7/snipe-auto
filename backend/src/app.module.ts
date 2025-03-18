// src/app.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
// Import all previously created modules
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

@Module({
  imports: [
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
  ],
})
export class AppModule {}
