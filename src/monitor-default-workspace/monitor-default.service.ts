import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { currentDateTime } from '@us-epa-camd/easey-common/utilities/functions';
import { EntityManager } from 'typeorm';
import { v4 as uuid } from 'uuid';

import {
  MonitorDefaultBaseDTO,
  MonitorDefaultDTO,
} from '../dtos/monitor-default.dto';
import { MonitorDefault } from '../entities/workspace/monitor-default.entity';
import { MonitorDefaultMap } from '../maps/monitor-default.map';
import { MonitorPlanWorkspaceService } from '../monitor-plan-workspace/monitor-plan.service';
import { withTransaction } from '../utils';
import { MonitorDefaultWorkspaceRepository } from './monitor-default.repository';

@Injectable()
export class MonitorDefaultWorkspaceService {
  constructor(
    private readonly repository: MonitorDefaultWorkspaceRepository,
    private readonly map: MonitorDefaultMap,
    private readonly logger: Logger,

    @Inject(forwardRef(() => MonitorPlanWorkspaceService))
    private readonly mpService: MonitorPlanWorkspaceService,
  ) {}

  async getDefaults(locationId: string): Promise<MonitorDefaultDTO[]> {
    const results = await this.repository.findBy({ locationId });
    return this.map.many(results);
  }

  async getDefault(
    locationId: string,
    defaultId: string,
    trx?: EntityManager,
  ): Promise<MonitorDefault> {
    const result = await withTransaction(this.repository, trx).getDefault(
      locationId,
      defaultId,
    );

    if (!result) {
      throw new EaseyException(
        new Error('Monitor Default Not Found'),
        HttpStatus.NOT_FOUND,
        {
          locationId: locationId,
          defaultId: defaultId,
        },
      );
    }

    return result;
  }

  async createDefault({
    locationId,
    payload,
    userId,
    isImport = false,
    trx,
  }: {
    locationId: string;
    payload: MonitorDefaultBaseDTO;
    userId: string;
    isImport?: boolean;
    trx?: EntityManager;
  }): Promise<MonitorDefaultDTO> {
    const repository = withTransaction(this.repository, trx);

    const monDefault = repository.create({
      id: uuid(),
      locationId,
      parameterCode: payload.parameterCode,
      defaultValue: payload.defaultValue,
      defaultUnitsOfMeasureCode: payload.defaultUnitsOfMeasureCode,
      defaultPurposeCode: payload.defaultPurposeCode,
      fuelCode: payload.fuelCode,
      operatingConditionCode: payload.operatingConditionCode,
      defaultSourceCode: payload.defaultSourceCode,
      groupId: payload.groupId,
      beginDate: payload.beginDate,
      beginHour: payload.beginHour,
      endDate: payload.endDate,
      endHour: payload.endHour,
      userId: userId,
      addDate: currentDateTime(),
      updateDate: currentDateTime(),
    });

    await repository.save(monDefault);

    if (!isImport) {
      await this.mpService.resetToNeedsEvaluation(locationId, userId, trx);
    }

    return this.map.one(monDefault);
  }

  async updateDefault({
    locationId,
    defaultId,
    payload,
    userId,
    isImport = false,
    trx,
  }: {
    locationId: string;
    defaultId: string;
    payload: MonitorDefaultBaseDTO;
    userId: string;
    isImport?: boolean;
    trx?: EntityManager;
  }): Promise<MonitorDefaultDTO> {
    const monDefault = await this.getDefault(locationId, defaultId, trx);

    monDefault.parameterCode = payload.parameterCode;
    monDefault.defaultValue = payload.defaultValue;
    monDefault.defaultUnitsOfMeasureCode = payload.defaultUnitsOfMeasureCode;
    monDefault.defaultPurposeCode = payload.defaultPurposeCode;
    monDefault.fuelCode = payload.fuelCode;
    monDefault.operatingConditionCode = payload.operatingConditionCode;
    monDefault.defaultSourceCode = payload.defaultSourceCode;
    monDefault.groupId = payload.groupId;
    monDefault.beginDate = payload.beginDate;
    monDefault.beginHour = payload.beginHour;
    monDefault.endDate = payload.endDate;
    monDefault.endHour = payload.endHour;
    monDefault.userId = userId;
    monDefault.updateDate = currentDateTime();

    await withTransaction(this.repository, trx).save(monDefault);

    if (!isImport) {
      await this.mpService.resetToNeedsEvaluation(locationId, userId, trx);
    }

    return this.map.one(monDefault);
  }

  async importDefault(
    locationId: string,
    monDefaults: MonitorDefaultBaseDTO[],
    userId: string,
    trx?: EntityManager,
  ) {
    await Promise.all(
      monDefaults.map(async monDefault => {
        const monDefaultRecord = await withTransaction(
          this.repository,
          trx,
        ).getDefaultBySpecs(
          locationId,
          monDefault.parameterCode,
          monDefault.defaultPurposeCode,
          monDefault.fuelCode,
          monDefault.operatingConditionCode,
          monDefault.beginDate,
          monDefault.beginHour,
          monDefault.endDate,
          monDefault.endHour,
        );

        if (monDefaultRecord) {
          await this.updateDefault({
            locationId,
            defaultId: monDefaultRecord.id,
            payload: monDefault,
            userId,
            isImport: true,
            trx,
          });
        } else {
          await this.createDefault({
            locationId,
            payload: monDefault,
            userId,
            isImport: true,
            trx,
          });
        }
      }),
    );
    return true;
  }
}
