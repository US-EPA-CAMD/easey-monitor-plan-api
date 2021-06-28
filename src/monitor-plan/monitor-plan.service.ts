import { MonitorLocation } from '../entities/monitor-location.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { MonitorPlanRepository } from './monitor-plan.repository';
import { MonitorLocationRepository } from '../monitor-location/monitor-location.repository';
import { MonitorPlanDTO } from '../dtos/monitor-plan.dto';
import { MonitorPlanMap } from '../maps/monitor-plan.map';
import { MonitorLocationDTO } from '../dtos/monitor-location.dto';
import { UnitOpStatusRepository } from '../monitor-location/unit-op-status.repository';
import { UnitOpStatus } from '../entities/unit-op-status.entity';

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
  ) {}

  async getConfigurations(orisCode: number): Promise<MonitorPlanDTO[]> {
    const plans = await this.monitorPlanRepository.getMonitorPlansByOrisCode(
      orisCode,
    );
    const unitStatuses = await this.unitOpStatusRepository.getUnitStatuses();
    //TODO: error handling here in case no plans returned
    const locations = await this.monitorLocationRepository.getMonitorLocationsByFacId(
      plans[0].facId,
    );
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
      if (a.name < b.name) {
        return -1;
      }

      if (a.name === b.name) {
        return 0;
      }

      return 1;
    });
    return this.setMonitoringPlanStatus(results, unitStatuses);
  }

  private setMonitoringPlanStatus(
    MonitoringPlanConfiguration: MonitorPlanDTO[],
    unitStatuses: UnitOpStatus[],
  ): MonitorPlanDTO[] {
    MonitoringPlanConfiguration.forEach(mp => {
      if (mp.endReportPeriodId == null) {
        mp.active = true;
      }
      mp.locations = this.setUnitAndStackStatus(mp.locations, unitStatuses);
      delete mp['endReportPeriodId'];
    });
    return MonitoringPlanConfiguration;
  }

  private setUnitAndStackStatus(
    monLocation: MonitorLocationDTO[],
    unitStatuses: UnitOpStatus[],
  ): MonitorLocationDTO[] {
    monLocation.forEach(loc => {
      if (loc.type == 'Unit') {
        loc.active = this.setUnitStatus(unitStatuses, loc);
      }

      if (loc.type == 'Stack') {
        if (loc.retireDate == null) {
          loc.active = true;
        }
      }
      delete loc['retireDate'];
    });
    return monLocation;
  }

  private setUnitStatus(
    unitStatuses: UnitOpStatus[],
    monLocation: MonitorLocationDTO,
  ): boolean {
    const unitId = parseInt(monLocation.id);
    unitStatuses.forEach(unitstatus => {
      if (unitstatus.unitId == unitId) {
        if (unitstatus.endDate == null && unitstatus.opStatusCode == 'RET') {
          return false;
        }
      }
    });
    return true;
  }
}
