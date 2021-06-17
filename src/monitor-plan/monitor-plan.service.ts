import { MonitorLocation } from '../entities/monitor-location.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { MonitorPlanRepository } from './monitor-plan.repository';
import { MonitorLocationRepository } from '../monitor-location/monitor-location.repository';
import { MonitorPlanDTO } from '../dtos/monitor-plan.dto';
import { MonitorPlanMap } from '../maps/monitor-plan.map';
import { MonitorLocationDTO } from '../dtos/monitor-location.dto';
import { UnitOpStatusRepository } from '../monitor-location/unit-op-status.repository';
import { UnitOpStatusMap } from '../maps/unit-op-status.map';
import { UnitOpStatus } from '../entities/unit-op-status.entity';
import { UserCheckOutRepository } from './user-check-out.repository';
import { UserCheckOut } from 'src/entities/user-check-out.entity';

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
    @InjectRepository(UserCheckOutRepository)
    private userCheckOutRepository: UserCheckOutRepository,
    private UnitStatusmap: UnitOpStatusMap,
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
      return a.name < b.name ? -1 : a.name == b.name ? 0 : 1;
    });
    return this.setMonitoringPlanStatus(results, unitStatuses);
  }

  setMonitoringPlanStatus(
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

  setUnitAndStackStatus(
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

  setUnitStatus(
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

  getUserCheckOutByMonPlanId(monPlanId: string): Promise<UserCheckOut> {
    const data = this.userCheckOutRepository.getUserCheckOutByMonPlanId(
      monPlanId,
    );

    return data;
  }

  async getUserCheckOut(
    monPlanId: string,
    username: string,
  ): Promise<UserCheckOut> {
    const record = this.userCheckOutRepository.checkOutMonitorPlan(
      monPlanId,
      username,
    );

    return record;
  }

  async updateLockExpiration(monPlanId: string): Promise<UserCheckOut> {
    const data = await this.getUserCheckOutByMonPlanId(monPlanId);

    const newExp = new Date(+data.expiration.getTime() + 15 * 60 * 1000);

    const record = await this.userCheckOutRepository.updateCheckOutExpiration(
      monPlanId,
      newExp,
    );

    return record.raw;
  }
}
