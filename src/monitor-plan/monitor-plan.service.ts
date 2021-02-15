import { MonitorLocation } from 'src/entities/monitor-location.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { MonitorPlanRepository } from './monitor-plan.repository';
import { MonitorLocationRepository } from '../monitor-location/monitor-location.repository';
import { MonitorPlanDTO } from '../dtos/monitor-plan.dto';
import { MonitorPlanMap } from '../maps/monitor-plan.map';
import { MonitorLocationDTO } from 'src/dtos/monitor-location.dto';
import { UnitOpStatusRepository} from '../monitor-location/unit-op-status.repository'
import { UnitOpStatusDTO } from 'src/dtos/unit-op-status.dto';
import { UnitOpStatusMap } from 'src/maps/unit-op-status.map';

@Injectable()
export class MonitorPlanService {
  constructor(
    @InjectRepository(MonitorPlanRepository)
    private monitorPlanRepository: MonitorPlanRepository,
    @InjectRepository(MonitorLocationRepository)
    private monitorLocationRepository: MonitorLocationRepository,
    private map: MonitorPlanMap,
    @InjectRepository(UnitOpStatusRepository)
    private unitOpStatusRepository: UnitOpStatusRepository,
    private UnitStatusmap: UnitOpStatusMap,
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
       mp.locations = this.setUnitAndStackStatus(mp.locations);
      delete mp['endReportPeriodId'];
      delete mp['retireDate'];
  });
  return MonitoringPlanConfiguration;
}

setUnitAndStackStatus(monLocation: MonitorLocationDTO[]): MonitorLocationDTO[] {
  monLocation.forEach(loc => {
    if(loc.type == 'Unit' ){
    loc.active = false;
    this.checkUnitStatus(loc);
    }

    if(loc.type == 'Stack' ){
      if(loc.retireDate == null ){
        loc.active = true; 
      }
    }
  });
  return monLocation;
}

async checkUnitStatus(monLocation: MonitorLocationDTO){
  //to be implemented  
}

}