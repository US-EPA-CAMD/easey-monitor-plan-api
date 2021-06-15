import { MonitorLocation } from '../entities/monitor-location.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { MonitorPlanRepository } from './monitor-plan.repository';
import { MonitorLocationRepository } from '../monitor-location/monitor-location.repository';
import { MonitorPlanDTO } from '../dtos/monitor-plan.dto';
import { MonitorPlanMap } from '../maps/monitor-plan.map';
import { MonitorLocationDTO } from '../dtos/monitor-location.dto';
import { UnitOpStatusRepository } from '../monitor-location/unit-op-status.repository';
import { UnitOpStatusMap } from '../maps/unit-op-status.map';
import { UnitOpStatus } from '../entities/unit-op-status.entity';
import { UserCheckOutRepository } from './user-check-out.repository';
import { UserCheckOutDTO } from 'src/dtos/user-check-out.dto';

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

  // async getUserCheckOut(): Promise<UserCheckOut> {
  //   // const found;
  // }

  async getUserCheckOut(monPlanId: string, userCheckOutDTO: UserCheckOutDTO) {
    const { user } = userCheckOutDTO;

    const result = await this.userCheckOutRepository.getUserCheckOut(monPlanId);

    if (!result) {
      //  If no other plan checked out then check to see if a workspace record exists
      //  If no workspace record then copy entire plan from camdecmps schema over to the camdecmpswks schema
      //  If workspace copy exists then return successful message (successful message indicates that a workspace copy exists)
    }

    //  This method will need to check the lock table to see if the facility is already locked by another user or not
    //  If locked by another user then return an error

    if (result && result.checkedOutBy !== user) {
      throw new ForbiddenException(
        'This configuration is currently checked-out by another user.',
      );
    }

    //  If not locked by another user then check to see if the user already has another plan checked out
    //  If another plan is checked out return an error
  }

  // checkOutPlanConfiguration(id: number, userName: string) {}

  // getLockStatus(id: string): Promise<MonitorPlanLock> {
  // }
}
