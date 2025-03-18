// src/alerts/alerts.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Alert, AlertDocument } from './schemas/alert.schema';

@Injectable()
export class AlertsService {
  constructor(
    @InjectModel(Alert.name) private alertModel: Model<AlertDocument>,
  ) {}

  // Create a new alert for a user.
  async createAlert(data: {
    userWalletAddress: string;
    alertType: string;
    threshold: number;
  }): Promise<Alert> {
    const alert = new this.alertModel(data);
    return alert.save();
  }

  // Retrieve all alerts for a given user.
  async getAlerts(userWalletAddress: string): Promise<Alert[]> {
    return this.alertModel.find({ userWalletAddress }).exec();
  }

  // Simulate checking alerts: for demonstration, randomly mark some alerts as triggered.
  async checkAlerts(userWalletAddress: string): Promise<Alert[]> {
    const alerts = await this.getAlerts(userWalletAddress);
    // For simulation, let's mark alerts with a random chance as triggered.
    for (const alert of alerts) {
      // Simulated condition: if a random number between 0 and 1 exceeds 0.7, mark as triggered.
      if (Math.random() > 0.7) {
        alert.triggered = true;
        // @ts-ignore
        await alert.save();
      }
    }
    return alerts;
  }
}
