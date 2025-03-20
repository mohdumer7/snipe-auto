import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as client from 'prom-client';

@Injectable()
export class MetricsService implements OnModuleInit {
  private readonly logger = new Logger(MetricsService.name);

  keyDecryptionDuration = new client.Histogram({
    name: 'wallet_key_decryption_duration_seconds',
    help: 'Time taken to decrypt wallet key using AWS KMS',
    buckets: [0.1, 0.5, 1, 2, 5],
  });

  transactionConfirmationDelay = new client.Histogram({
    name: 'transaction_confirmation_delay_seconds',
    help: 'Time taken for transaction confirmation',
    buckets: [1, 2, 5, 10, 20],
  });

  errorCounter = new client.Counter({
    name: 'application_errors_total',
    help: 'Total number of errors encountered',
  });

  onModuleInit() {
    // Ensure default metrics are collected only once
    client.register.clear();
    client.collectDefaultMetrics();
    this.logger.log('Default metrics collected');
  }

  recordKeyDecryption(duration: number) {
    this.keyDecryptionDuration.observe(duration);
  }

  recordTransactionConfirmation(delay: number) {
    this.transactionConfirmationDelay.observe(delay);
  }

  incrementErrorCount() {
    this.errorCounter.inc();
  }
}
