import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { currentDateTime } from '@us-epa-camd/easey-common/utilities/functions';
import { EntityManager } from 'typeorm';
import { v4 as uuid } from 'uuid';

import {
  MonitorMethodBaseDTO,
  MonitorMethodDTO,
} from '../dtos/monitor-method.dto';
import { MonitorMethod } from '../entities/workspace/monitor-method.entity';
import { MonitorMethodMap } from '../maps/monitor-method.map';
import { MonitorPlanWorkspaceService } from '../monitor-plan-workspace/monitor-plan.service';
import { withTransaction } from '../utils';
import { MonitorMethodWorkspaceRepository } from './monitor-method.repository';

@Injectable()
export class MonitorMethodWorkspaceService {
  constructor(
    private readonly repository: MonitorMethodWorkspaceRepository,
    private readonly map: MonitorMethodMap,

    @Inject(forwardRef(() => MonitorPlanWorkspaceService))
    private readonly mpService: MonitorPlanWorkspaceService,
  ) {}

  async getMethods(locId: string): Promise<MonitorMethodDTO[]> {
    const results = await this.repository.findBy({ locationId: locId });
    return this.map.many(results);
  }

  async getMethod(
    methodId: string,
    trx?: EntityManager,
  ): Promise<MonitorMethod> {
    const result = await withTransaction(this.repository, trx).findOneBy({
      id: methodId,
    });

    if (!result) {
      throw new EaseyException(
        new Error('Monitor Method Not Found'),
        HttpStatus.NOT_FOUND,
        {
          methodId: methodId,
        },
      );
    }

    return result;
  }

  async createMethod({
    locationId,
    payload,
    userId,
    isImport = false,
    trx,
  }: {
    locationId: string;
    payload: MonitorMethodBaseDTO;
    userId: string;
    isImport?: boolean;
    trx?: EntityManager;
  }): Promise<MonitorMethodDTO> {
    const repository = withTransaction(this.repository, trx);

    const monMethod = repository.create({
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

    await repository.save(monMethod);

    if (!isImport) {
      await this.mpService.resetToNeedsEvaluation(locationId, userId, trx);
    }

    return this.map.one(monMethod);
  }

  async updateMethod({
    methodId,
    payload,
    locationId,
    userId,
    isImport = false,
    trx,
  }: {
    methodId: string;
    payload: MonitorMethodBaseDTO;
    locationId: string;
    userId: string;
    isImport?: boolean;
    trx?: EntityManager;
  }): Promise<MonitorMethodDTO> {
    const method = await this.getMethod(methodId, trx);

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

    await withTransaction(this.repository, trx).save(method);

    if (!isImport) {
      await this.mpService.resetToNeedsEvaluation(locationId, userId, trx);
    }

    return this.map.one(method);
  }

  async importMethod(
    locationId: string,
    methods: MonitorMethodBaseDTO[],
    userId: string,
    trx?: EntityManager,
  ) {
    return Promise.all(
      methods.map(async method => {
        const methodRecord = await withTransaction(
          this.repository,
          trx,
        ).getMethodByLocIdParamCDBDate(
          locationId,
          method.parameterCode,
          method.beginDate,
          method.beginHour,
          method.endDate,
          method.endHour,
        );

        if (methodRecord) {
          await this.updateMethod({
            methodId: methodRecord.id,
            payload: method,
            locationId,
            userId,
            isImport: true,
            trx,
          });
        } else {
          await this.createMethod({
            locationId,
            payload: method,
            userId,
            isImport: true,
            trx,
          });
        }
      }),
    );
  }
}
