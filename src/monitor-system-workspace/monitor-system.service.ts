import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuid } from 'uuid';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { MonitorSystemMap } from '../maps/monitor-system.map';
import {
  MonitorSystemBaseDTO,
  MonitorSystemDTO,
} from '../dtos/monitor-system.dto';
import { MonitorSystem } from '../entities/monitor-system.entity';
import { MonitorSystemWorkspaceRepository } from './monitor-system.repository';
import { MonitorPlanWorkspaceService } from '../monitor-plan-workspace/monitor-plan.service';

@Injectable()
export class MonitorSystemWorkspaceService {
  constructor(
    @InjectRepository(MonitorSystemWorkspaceRepository)
    private readonly repository: MonitorSystemWorkspaceRepository,
    private readonly map: MonitorSystemMap,
    private readonly logger: Logger,

    @Inject(forwardRef(() => MonitorPlanWorkspaceService))
    private readonly mpService: MonitorPlanWorkspaceService,
  ) {}

  async getSystems(locationId: string): Promise<MonitorSystemDTO[]> {
    const results = await this.repository.find({
      where: {
        locationId,
      },
      order: {
        monitoringSystemId: 'ASC',
      },
    });
    return this.map.many(results);
  }

  async createSystem(
    locationId: string,
    payload: MonitorSystemBaseDTO,
    userId: string,
  ): Promise<MonitorSystemDTO> {
    const system = this.repository.create({
      id: uuid(),
      locationId,
      monitoringSystemId: payload.monitoringSystemId,
      systemDesignationCode: payload.systemDesignationCode,
      fuelCode: payload.fuelCode,
      systemTypeCode: payload.systemTypeCode,
      beginDate: payload.beginDate,
      beginHour: payload.beginHour,
      endDate: payload.endDate,
      endHour: payload.endHour,
      userId: userId,
      addDate: new Date(Date.now()),
      updateDate: new Date(Date.now()),
    });

    await this.repository.save(system);
    await this.mpService.resetToNeedsEvaluation(locationId, userId);
    return this.map.one(system);
  }

  async getSystem(monitoringSystemId: string): Promise<MonitorSystem> {
    const result = await this.repository.findOne(monitoringSystemId);

    if (!result) {
      this.logger.error(NotFoundException, 'Monitor System Not Found', true, {
        monitoringSystemId: monitoringSystemId,
      });
    }

    return result;
  }

  async updateSystem(
    monitoringSystemId: string,
    payload: MonitorSystemBaseDTO,
    locId: string,
    userId: string,
  ): Promise<MonitorSystemDTO> {
    const system = await this.getSystem(monitoringSystemId);

    system.systemTypeCode = payload.systemTypeCode;
    system.systemDesignationCode = payload.systemDesignationCode;
    system.fuelCode = payload.fuelCode;
    system.beginDate = payload.beginDate;
    system.beginHour = payload.beginHour;
    system.endDate = payload.endDate;
    system.endHour = payload.endHour;
    system.userId = userId;
    system.updateDate = new Date(Date.now());

    await this.repository.save(system);
    await this.mpService.resetToNeedsEvaluation(locId, userId);
    return this.map.one(system);
  }
}
