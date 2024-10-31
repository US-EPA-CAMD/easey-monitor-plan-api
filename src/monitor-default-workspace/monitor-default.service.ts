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
  ) {
    this.logger.setContext('MonitorDefaultWorkspaceService');
  }

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
    this.logger.debug(`we are in monitorDefaultWorkspaceService.updateDefault()`);
    this.logger.debug(`passed-in locationId: ${locationId}`);
    this.logger.debug(`passed-in defaultId: ${defaultId}`);
    const monDefault = await this.getDefault(locationId, defaultId, trx);

    this.logger.debug(`parameterCode from payload: ${payload.parameterCode}`);
    this.logger.debug(`parameterCode from monDefault: ${monDefault.parameterCode}`);
    monDefault.parameterCode = payload.parameterCode;
    this.logger.debug(`parameterCode from monDefault after assigned: ${monDefault.parameterCode}`);
    monDefault.defaultValue = payload.defaultValue;
    monDefault.defaultUnitsOfMeasureCode = payload.defaultUnitsOfMeasureCode;
    monDefault.defaultPurposeCode = payload.defaultPurposeCode;
    monDefault.fuelCode = payload.fuelCode;
    monDefault.operatingConditionCode = payload.operatingConditionCode;
    monDefault.defaultSourceCode = payload.defaultSourceCode;
    monDefault.groupId = payload.groupId;
    monDefault.beginDate = payload.beginDate;
    monDefault.beginHour = payload.beginHour;
    this.logger.debug(`endDate from payload: ${payload.endDate}`);
    this.logger.debug(`endDate from monDefault: ${monDefault.endDate}`);
    monDefault.endDate = payload.endDate;
    this.logger.debug(`endDate from monDefault after assigned: ${monDefault.endDate}`);
    monDefault.endHour = payload.endHour;
    monDefault.userId = userId;
    monDefault.updateDate = currentDateTime();

    await withTransaction(this.repository, trx).save(monDefault);

    if (!isImport) {
      await this.mpService.resetToNeedsEvaluation(locationId, userId, trx);
    }

    return this.map.one(monDefault);
  }

  //when we import the default, override happend
  async importDefault(
    locationId: string,
    monDefaults: MonitorDefaultBaseDTO[],
    userId: string,
    trx?: EntityManager,
  ) {
    this.logger.debug(`we are in monitorDefaultWorkspaceService.importDefault()`);
    //
    monDefaults.forEach ( item => {
      this.logger.debug(`${item.parameterCode}`);
      this.logger.debug(`${item.beginDate}`);
      this.logger.debug(`${item.endDate}`);
      this.logger.debug(`=========================`);

    });
    
    await Promise.all(
      monDefaults.map(async monDefault => {
        //get each of the record from the imported file
        const monDefaultRecord = await withTransaction(
          this.repository,
          trx,
        ).getDefaultBySpecs(
          locationId,
          //MonitorDefaultBaseDTO do not have the id so it can not be used 
          monDefault.parameterCode,
          monDefault.defaultPurposeCode,
          monDefault.fuelCode,
          monDefault.operatingConditionCode,
          monDefault.beginDate,
          monDefault.beginHour,
          monDefault.endDate,
          monDefault.endHour,
        );

        //if we can find the exact matching record, then we will update the record, if not found, then need to create a new records
        //my question is: if we use the exactly same matching, then what's the point of updating it using the same info?
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
    this.logger.debug(`Imported ${monDefaults.length} monitor defaults`);
    return true;
  }
}
