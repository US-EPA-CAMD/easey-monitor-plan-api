import { MonitorLocation } from 'src/entities/monitor-location.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { MonitorPlanRepository } from './monitor-plan.repository';
import { MonitorLocationRepository } from '../monitor-location/monitor-location.repository';
import { MonitorPlanDTO } from '../dtos/monitor-plan.dto';
import { MonitorPlanMap } from '../maps/monitor-plan.map';

@Injectable()
export class MonitorPlanService {
  constructor(
    @InjectRepository(MonitorPlanRepository)
    private monitorPlanRepository: MonitorPlanRepository,
    @InjectRepository(MonitorLocationRepository)
    private monitorLocationRepository: MonitorLocationRepository,
    private map: MonitorPlanMap
  ) {}

  async getConfigurations(orisCode: number): Promise<MonitorPlanDTO[]> {
    const plans = await this.monitorPlanRepository.getMonitorPlansByOrisCode(orisCode);
    //TODO: error handling here in case no plans returned
    const locations = await this.monitorLocationRepository.getMonitorLocationsByFacId(plans[0].facId);
    plans.forEach(p => {
      const matchedLocations: MonitorLocation[] = [];
      locations.forEach(l => {
        const planIds = l.plans.map(lp => lp.id);
        if (planIds.includes(p.id)) {
          matchedLocations.push(l);
        }
      });
      p.locations = matchedLocations;
    });
    const results = await this.map.many(plans);
    results.sort((a, b) => {
      return (a.name < b.name) ? -1 : (a.name == b.name) ? 0 : 1
    });
    return this.setMonitoringPlanStatus(results);
    }


 setMonitoringPlanStatus(MonitoringPlanConfiguration: MonitorPlanDTO[]): MonitorPlanDTO[] {
    MonitoringPlanConfiguration.forEach(mp => {
      if(mp.endReportPeriodId == null){
        mp.active = true;
      }      
  });
  return MonitoringPlanConfiguration;
}
}