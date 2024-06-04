import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MonitorPlanSchema } from './monitor.plan.schema.response';

@Injectable()
export class EaseyContentService {
  monitorPlanSchema: MonitorPlanSchema;
  constructor(private readonly configService: ConfigService) {
    console.log();
    this.getMonitorPlanSchema();
  }

  async getMonitorPlanSchema(): Promise<void> {
    try {
      const response = await fetch(
        `${
          this.configService.get('app').contentApi.uri
        }/ecmps/reporting-instructions/monitor-plan.schema.json`,
      );
      if (response.ok) this.monitorPlanSchema = await response.json();
    } catch (e) {
      console.log(e);
    }
  }
}
