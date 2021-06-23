import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { MonitorPlanWorkspaceRepository } from './monitor-plan.repository';
import { MonitorLocationWorkspaceRepository } from '../monitor-location-workspace/monitor-location.repository';
import { UnitOpStatusRepository } from '../monitor-location/unit-op-status.repository';
import { UserCheckOutRepository } from './user-check-out.repository';

import { MonitorPlanDTO } from '../dtos/monitor-plan.dto';
import { MonitorLocationDTO } from '../dtos/monitor-location.dto';

import { MonitorPlanMap } from '../maps/monitor-plan.map';

import { MonitorLocation } from '../entities/workspace/monitor-location.entity';
import { UserCheckOut } from '../entities/workspace/user-check-out.entity';
import { UnitOpStatus } from '../entities/unit-op-status.entity';

@Injectable()
export class MonitorPlanWorkspaceService {
  constructor(
    @InjectRepository(MonitorPlanWorkspaceRepository)
    private monitorPlanRepository: MonitorPlanWorkspaceRepository,
    @InjectRepository(MonitorLocationWorkspaceRepository)
    private monitorLocationRepository: MonitorLocationWorkspaceRepository,
    private map: MonitorPlanMap,
    @InjectRepository(UnitOpStatusRepository)
    private unitOpStatusRepository: UnitOpStatusRepository,
    @InjectRepository(UserCheckOutRepository)
    private userCheckOutRepository: UserCheckOutRepository,
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

  async getCheckOutConfiguration(monPlanId: string) {
    const record = await this.userCheckOutRepository.findOne({ monPlanId });

    if (!record) {
      throw new NotFoundException(`Checkout configuration not found.`);
    }

    return record;
  }

  async checkOutConfiguration(
    monPlanId: string,
    username: string,
  ): Promise<UserCheckOut> {
    return this.userCheckOutRepository.checkOutMonitorPlan(monPlanId, username);
  }

  async updateLastActivity(monPlanId: string): Promise<UserCheckOut> {
    const record = await this.getCheckOutConfiguration(monPlanId);
    record.lastActivity = new Date(Date.now());
    return this.userCheckOutRepository.save(record);
  }
}
