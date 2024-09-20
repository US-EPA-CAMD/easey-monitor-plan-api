import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { currentDateTime } from '@us-epa-camd/easey-common/utilities/functions';
import { EntityManager } from 'typeorm';
import { v4 as uuid } from 'uuid';

import { MatsMethodBaseDTO, MatsMethodDTO } from '../dtos/mats-method.dto';
import { MatsMethodMap } from '../maps/mats-method.map';
import { MonitorPlanWorkspaceService } from '../monitor-plan-workspace/monitor-plan.service';
import { withTransaction } from '../utils';
import { MatsMethodWorkspaceRepository } from './mats-method.repository';

@Injectable()
export class MatsMethodWorkspaceService {
  constructor(
    private readonly repository: MatsMethodWorkspaceRepository,
    private readonly map: MatsMethodMap,
    private readonly logger: Logger,

    @Inject(forwardRef(() => MonitorPlanWorkspaceService))
    private readonly mpService: MonitorPlanWorkspaceService,
  ) {
    this.logger.setContext('MatsMethodWorkspaceService');
  }

  async getMethods(locationId: string): Promise<MatsMethodDTO[]> {
    const results = await this.repository.findBy({ locationId });
    return this.map.many(results);
  }

  async getMethod(methodId: string): Promise<MatsMethodDTO> {
    const result = await this.repository.findOneBy({ id: methodId });

    if (!result) {
      throw new EaseyException(
        new Error('Mats Method not found.'),
        HttpStatus.NOT_FOUND,
        {
          methodId: methodId,
        },
      );
    }

    return this.map.one(result);
  }

  async createMethod({
    locationId,
    payload,
    userId,
    isImport = false,
    trx,
  }: {
    locationId: string;
    payload: MatsMethodBaseDTO;
    userId: string;
    isImport?: boolean;
    trx?: EntityManager;
  }): Promise<MatsMethodDTO> {
    const repository = withTransaction(this.repository, trx);

    const method = repository.create({
      id: uuid(),
      locationId,
      supplementalMATSParameterCode: payload.supplementalMATSParameterCode,
      supplementalMATSMonitoringMethodCode:
        payload.supplementalMATSMonitoringMethodCode,
      beginDate: payload.beginDate,
      beginHour: payload.beginHour,
      endDate: payload.endDate,
      endHour: payload.endHour,
      userId: userId,
      addDate: currentDateTime(),
      updateDate: currentDateTime(),
    });

    await repository.save(method);

    if (!isImport) {
      await this.mpService.resetToNeedsEvaluation(locationId, userId, trx);
    }

    return this.map.one(method);
  }

  async updateMethod({
    methodId,
    locationId,
    payload,
    userId,
    isImport = false,
    trx,
  }: {
    methodId: string;
    locationId: string;
    payload: MatsMethodBaseDTO;
    userId: string;
    isImport?: boolean;
    trx?: EntityManager;
  }): Promise<MatsMethodDTO> {
    const repository = withTransaction(this.repository, trx);

    const method = await repository.findOneBy({ id: methodId });

    if (!method) {
      throw new EaseyException(
        new Error('Mats Method not found.'),
        HttpStatus.NOT_FOUND,
        {
          methodId: methodId,
        },
      );
    }

    method.supplementalMATSParameterCode =
      payload.supplementalMATSParameterCode;
    method.supplementalMATSMonitoringMethodCode =
      payload.supplementalMATSMonitoringMethodCode;
    method.beginDate = payload.beginDate;
    method.beginHour = payload.beginHour;
    method.endDate = payload.endDate;
    method.endHour = payload.endHour;
    method.userId = userId;
    method.updateDate = currentDateTime();

    await repository.save(method);

    if (!isImport) {
      await this.mpService.resetToNeedsEvaluation(locationId, userId, trx);
    }

    return this.map.one(method);
  }

  async importMatsMethod(
    locationId: string,
    matsMethods: MatsMethodBaseDTO[],
    userId: string,
    trx?: EntityManager,
  ) {
    await Promise.all(
      matsMethods.map(async matsMethod => {
        let method = await withTransaction(
          this.repository,
          trx,
        ).getMatsMethodByLodIdParamCodeAndDate(locationId, matsMethod);

        if (method) {
          await this.updateMethod({
            methodId: method.id,
            locationId: method.locationId,
            payload: matsMethod,
            userId,
            isImport: true,
            trx,
          });
        } else {
          await this.createMethod({
            locationId,
            payload: matsMethod,
            userId,
            isImport: true,
            trx,
          });
        }
      }),
    );
    this.logger.debug(`Imported ${matsMethods.length} mats methods`);
    return true;
  }
}
