import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuid } from 'uuid';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { MonitorLoadBaseDTO, MonitorLoadDTO } from '../dtos/monitor-load.dto';
import { MonitorLoadMap } from '../maps/monitor-load.map';
import { MonitorLoadWorkspaceRepository } from './monitor-load.repository';
import { MonitorLoad } from '../entities/workspace/monitor-load.entity';
import { MonitorPlanWorkspaceService } from '../monitor-plan-workspace/monitor-plan.service';

@Injectable()
export class MonitorLoadWorkspaceService {
  constructor(
    @InjectRepository(MonitorLoadWorkspaceRepository)
    private readonly repository: MonitorLoadWorkspaceRepository,
    private readonly map: MonitorLoadMap,
    private readonly logger: Logger,

    @Inject(forwardRef(() => MonitorPlanWorkspaceService))
    private readonly mpService: MonitorPlanWorkspaceService,
  ) {}

  async getLoads(locationId: string): Promise<MonitorLoadDTO[]> {
    const results = await this.repository.find({ locationId });
    return this.map.many(results);
  }

  async getLoad(loadId: string): Promise<MonitorLoad> {
    const result = await this.repository.findOne(loadId);

    if (!result) {
      this.logger.error(NotFoundException, 'Monitor Load Not Found', true, {
        loadId: loadId,
      });
    }

    return result;
  }

  async importLoad(
    locationId: string,
    loads: MonitorLoadBaseDTO[],
    userId: string,
  ) {
    return new Promise(async resolve => {
      const promises = [];

      for (const load of loads) {
        promises.push(
          new Promise(async innerResolve => {
            const loadRecord = await this.repository.getLoadByLocBDateBHour(
              locationId,
              load.beginDate,
              load.beginHour,
            );

            if (loadRecord !== undefined) {
              await this.updateLoad(
                locationId,
                loadRecord.id,
                load,
                userId,
                true,
              );
            } else {
              await this.createLoad(locationId, load, userId, true);
            }

            innerResolve(true);
          }),
        );

        await Promise.all(promises);
        resolve(true);
      }
    });
  }

  async createLoad(
    locationId: string,
    payload: MonitorLoadBaseDTO,
    userId: string,
    isImport = false,
  ): Promise<MonitorLoadDTO> {
    const load = this.repository.create({
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
      addDate: new Date(Date.now()),
      updateDate: new Date(Date.now()),
    });

    await this.repository.save(load);

    if (!isImport) {
      await this.mpService.resetToNeedsEvaluation(locationId, userId);
    }

    return this.map.one(load);
  }

  async updateLoad(
    locationId: string,
    loadId: string,
    payload: MonitorLoadBaseDTO,
    userId: string,
    isImport = false,
  ): Promise<MonitorLoadDTO> {
    const load = await this.getLoad(loadId);

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
    load.updateDate = new Date(Date.now());

    await this.repository.save(load);
    await this.mpService.resetToNeedsEvaluation(locationId, userId);
    return this.map.one(load);
  }
}
