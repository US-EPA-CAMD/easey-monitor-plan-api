import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuid } from 'uuid';
import { Logger } from '@us-epa-camd/easey-common/logger';
import {
  MonitorMethodBaseDTO,
  MonitorMethodDTO,
} from '../dtos/monitor-method.dto';
import { MonitorMethodMap } from '../maps/monitor-method.map';
import { MonitorMethod } from '../entities/workspace/monitor-method.entity';
import { MonitorPlanWorkspaceService } from '../monitor-plan-workspace/monitor-plan.service';
import { MonitorMethodWorkspaceRepository } from './monitor-method.repository';

@Injectable()
export class MonitorMethodWorkspaceService {
  constructor(
    @InjectRepository(MonitorMethodWorkspaceRepository)
    private readonly repository: MonitorMethodWorkspaceRepository,
    private readonly map: MonitorMethodMap,
    private readonly logger: Logger,

    @Inject(forwardRef(() => MonitorPlanWorkspaceService))
    private readonly mpService: MonitorPlanWorkspaceService,
  ) {}

  async getMethods(locId: string): Promise<MonitorMethodDTO[]> {
    const results = await this.repository.find({ locationId: locId });
    return this.map.many(results);
  }

  async getMethod(methodId: string): Promise<MonitorMethod> {
    const result = this.repository.findOne(methodId);

    if (!result) {
      this.logger.error(NotFoundException, 'Monitor Method Not Found', true, {
        methodId: methodId,
      });
    }

    return result;
  }

  async createMethod(
    locationId: string,
    payload: MonitorMethodBaseDTO,
    userId: string,
  ): Promise<MonitorMethodDTO> {
    const monMethod = this.repository.create({
      id: uuid(),
      locationId,
      parameterCode: payload.parameterCode,
      substituteDataCode: payload.substituteDataCode,
      bypassApproachCode: payload.bypassApproachCode,
      monitoringMethodCode: payload.monitoringMethodCode,
      beginDate: payload.beginDate,
      beginHour: payload.beginHour,
      endDate: payload.endDate,
      endHour: payload.endHour,
      userId: userId,
      addDate: new Date(Date.now()),
      updateDate: new Date(Date.now()),
    });

    await this.repository.save(monMethod);
    await this.mpService.resetToNeedsEvaluation(locationId, userId);
    return this.map.one(monMethod);
  }

  async updateMethod(
    methodId: string,
    payload: MonitorMethodBaseDTO,
    locationId: string,
    userId: string,
  ): Promise<MonitorMethodDTO> {
    const method = await this.getMethod(methodId);

    method.parameterCode = payload.parameterCode;
    method.substituteDataCode = payload.substituteDataCode;
    method.bypassApproachCode = payload.bypassApproachCode;
    method.monitoringMethodCode = payload.monitoringMethodCode;
    method.beginDate = payload.beginDate;
    method.beginHour = payload.beginHour;
    method.endDate = payload.endDate;
    method.endHour = payload.endHour;
    method.userId = userId;
    method.updateDate = new Date(Date.now());

    await this.repository.save(method);
    await this.mpService.resetToNeedsEvaluation(locationId, userId);
    return this.map.one(method);
  }
}
