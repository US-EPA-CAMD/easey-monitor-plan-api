import {
  forwardRef,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuid } from 'uuid';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';

import {
  MonitorMethodBaseDTO,
  MonitorMethodDTO,
} from '../dtos/monitor-method.dto';
import { MonitorMethodMap } from '../maps/monitor-method.map';
import { MonitorMethod } from '../entities/workspace/monitor-method.entity';
import { MonitorPlanWorkspaceService } from '../monitor-plan-workspace/monitor-plan.service';
import { MonitorMethodWorkspaceRepository } from './monitor-method.repository';
import {currentDateTime} from "@us-epa-camd/easey-common/utilities/functions";

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
      throw new LoggingException(
        'Monitor Method Not Found',
        HttpStatus.NOT_FOUND,
        {
          methodId: methodId,
        },
      );
    }

    return result;
  }

  async createMethod(
    locationId: string,
    payload: MonitorMethodBaseDTO,
    userId: string,
    isImport = false,
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
      addDate: currentDateTime(),
      updateDate: currentDateTime(),
    });

    await this.repository.save(monMethod);

    if (!isImport) {
      await this.mpService.resetToNeedsEvaluation(locationId, userId);
    }

    return this.map.one(monMethod);
  }

  async updateMethod(
    methodId: string,
    payload: MonitorMethodBaseDTO,
    locationId: string,
    userId: string,
    isImport = false,
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
    method.updateDate = currentDateTime();

    await this.repository.save(method);

    if (!isImport) {
      await this.mpService.resetToNeedsEvaluation(locationId, userId);
    }

    return this.map.one(method);
  }

  async importMethod(
    locationId: string,
    methods: MonitorMethodBaseDTO[],
    userId: string,
  ) {
    return new Promise(async resolve => {
      const promises = [];

      for (const method of methods) {
        promises.push(
          new Promise(async innerResolve => {
            const methodRecord = await this.repository.getMethodByLocIdParamCDBDate(
              locationId,
              method.parameterCode,
              method.beginDate,
              method.beginHour,
              method.endDate,
              method.endHour,
            );

            if (methodRecord !== undefined) {
              await this.updateMethod(
                methodRecord.id,
                method,
                locationId,
                userId,
                true,
              );
            } else {
              await this.createMethod(locationId, method, userId, true);
            }

            innerResolve(true);
          }),
        );

        await Promise.all(promises);

        resolve(true);
      }
    });
  }
}
