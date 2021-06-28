import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { BaseMap } from './base.map';
import { MonitorPlan } from '../entities/monitor-plan.entity';
import { MonitorPlanDTO } from '../dtos/monitor-plan.dto';
import { MonitorLocationMap } from './monitor-location.map';

@Injectable()
export class MonitorPlanMap extends BaseMap<MonitorPlan, MonitorPlanDTO> {
  private path = `${this.configService.get<string>('app.uri')}/monitor-plans`;

  constructor(
    private configService: ConfigService,
    private locationMap: MonitorLocationMap,
  ) {
    super();
  }

  public async one(entity: MonitorPlan): Promise<MonitorPlanDTO> {
    const locations = await this.locationMap.many(entity.locations);

    return {
      id: entity.id,
      name: locations.map(l => l.name).join(', '),
      locations: locations,
      endReportPeriodId: entity.endReportPeriodId,
      active: false,
      links: [
        {
          rel: 'self',
          href: `${this.path}/${entity.id}`,
        },
      ],
    };
  }
}
