import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MonitorPlanService {
  constructor(private configService: ConfigService) {}

  getMonitorPlans(): string {
    console.log(`${this.configService.get('app.uri')}/monitor-plans`);
    return 'Hello getMonitorPlans!';
  }  
}
