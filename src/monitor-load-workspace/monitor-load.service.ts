import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { currentDateTime } from '@us-epa-camd/easey-common/utilities/functions';
import { EntityManager } from 'typeorm';
import { v4 as uuid } from 'uuid';

import { MonitorLoadBaseDTO, MonitorLoadDTO } from '../dtos/monitor-load.dto';
import { MonitorLoad } from '../entities/workspace/monitor-load.entity';
import { MonitorLoadMap } from '../maps/monitor-load.map';
import { MonitorPlanWorkspaceService } from '../monitor-plan-workspace/monitor-plan.service';
import { withTransaction } from '../utils';
import { MonitorLoadWorkspaceRepository } from './monitor-load.repository';

@Injectable()
export class MonitorLoadWorkspaceService {
  constructor(
    private readonly repository: MonitorLoadWorkspaceRepository,
    private readonly map: MonitorLoadMap,
    private readonly logger: Logger,

    @Inject(forwardRef(() => MonitorPlanWorkspaceService))
    private readonly mpService: MonitorPlanWorkspaceService,
  ) {}

  async getLoads(locationId: string): Promise<MonitorLoadDTO[]> {
    const results = await this.repository.findBy({ locationId });
    return this.map.many(results);
  }

  async getLoad(loadId: string, trx?: EntityManager): Promise<MonitorLoad> {
    const result = await withTransaction(this.repository, trx).findOneBy({
      id: loadId,
    });

    if (!result) {
      throw new EaseyException(
        new Error('Monitor Load Not Found'),
        HttpStatus.NOT_FOUND,
        {
          loadId: loadId,
        },
      );
    }

    return result;
  }

  async importLoad(
    locationId: string,
    loads: MonitorLoadBaseDTO[],
    userId: string,
    trx?: EntityManager,
  ) {
    return Promise.all(
      loads.map(async load => {
        const loadRecord = await withTransaction(
          this.repository,
          trx,
        ).getLoadByLocBDateBHour(
          locationId,
          load.beginDate,
          load.beginHour,
          load.endDate,
          load.endHour,
        );

        if (loadRecord) {
          await this.updateLoad({
            locationId,
            loadId: loadRecord.id,
            payload: load,
            userId,
            trx,
          });
        } else {
          await this.createLoad({
            locationId,
            payload: load,
            userId,
            isImport: true,
            trx,
          });
        }
      }),
    );
  }

  async createLoad({
    locationId,
    payload,
    userId,
    isImport = false,
    trx,
  }: {
    locationId: string;
    payload: MonitorLoadBaseDTO;
    userId: string;
    isImport?: boolean;
    trx?: EntityManager;
  }): Promise<MonitorLoadDTO> {
    const repository = withTransaction(this.repository, trx);

    const load = repository.create({
      id: uuid(),
      locationId,
      loadAnalysisDate: payload.loadAnalysisDate,
      beginDate: payload.beginDate,
      beginHour: payload.beginHour,
      endDate: payload.endDate,
      endHour: payload.endHour,
      maximumLoadValue: payload.maximumLoadValue,
      secondNormalIndicator: payload.secondNormalIndicator,
      upperOperationBoundary: payload.upperOperationBoundary,
      lowerOperationBoundary: payload.lowerOperationBoundary,
      normalLevelCode: payload.normalLevelCode,
      secondLevelCode: payload.secondLevelCode,
      maximumLoadUnitsOfMeasureCode: payload.maximumLoadUnitsOfMeasureCode,
      userId: userId,
      addDate: currentDateTime(),
      updateDate: currentDateTime(),
    });

    await repository.save(load);

    if (!isImport) {
      await this.mpService.resetToNeedsEvaluation(locationId, userId, trx);
    }

    return this.map.one(load);
  }

  async updateLoad({
    locationId,
    loadId,
    payload,
    userId,
    trx,
  }: {
    locationId: string;
    loadId: string;
    payload: MonitorLoadBaseDTO;
    userId: string;
    trx?: EntityManager;
  }): Promise<MonitorLoadDTO> {
    const load = await this.getLoad(loadId, trx);

    load.loadAnalysisDate = payload.loadAnalysisDate;
    load.beginDate = payload.beginDate;
    load.beginHour = payload.beginHour;
    load.endDate = payload.endDate;
    load.endHour = payload.endHour;
    load.maximumLoadValue = payload.maximumLoadValue;
    load.secondNormalIndicator = payload.secondNormalIndicator;
    load.upperOperationBoundary = payload.upperOperationBoundary;
    load.lowerOperationBoundary = payload.lowerOperationBoundary;
    load.normalLevelCode = payload.normalLevelCode;
    load.secondLevelCode = payload.secondLevelCode;
    load.maximumLoadUnitsOfMeasureCode = payload.maximumLoadUnitsOfMeasureCode;
    load.userId = userId;
    load.updateDate = currentDateTime();

    await withTransaction(this.repository, trx).save(load);
    await this.mpService.resetToNeedsEvaluation(locationId, userId, trx);
    return this.map.one(load);
  }
}
