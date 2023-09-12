import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuid } from 'uuid';
import { MatsMethodMap } from '../maps/mats-method.map';
import { MatsMethodBaseDTO, MatsMethodDTO } from '../dtos/mats-method.dto';
import { MonitorPlanWorkspaceService } from '../monitor-plan-workspace/monitor-plan.service';
import { MatsMethodWorkspaceRepository } from './mats-method.repository';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { currentDateTime } from '@us-epa-camd/easey-common/utilities/functions';

@Injectable()
export class MatsMethodWorkspaceService {
  constructor(
    @InjectRepository(MatsMethodWorkspaceRepository)
    private readonly repository: MatsMethodWorkspaceRepository,
    private readonly map: MatsMethodMap,

    @Inject(forwardRef(() => MonitorPlanWorkspaceService))
    private readonly mpService: MonitorPlanWorkspaceService,
  ) {}

  async getMethods(locationId: string): Promise<MatsMethodDTO[]> {
    const results = await this.repository.find({ locationId });
    return this.map.many(results);
  }

  async getMethod(methodId: string): Promise<MatsMethodDTO> {
    const result = await this.repository.findOne(methodId);

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

  async createMethod(
    locationId: string,
    payload: MatsMethodBaseDTO,
    userId: string,
    isImport = false,
  ): Promise<MatsMethodDTO> {
    const method = this.repository.create({
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

    await this.repository.save(method);

    if (!isImport) {
      await this.mpService.resetToNeedsEvaluation(locationId, userId);
    }

    return this.map.one(method);
  }

  async updateMethod(
    methodId: string,
    locationId: string,
    payload: MatsMethodBaseDTO,
    userId: string,
    isImport = false,
  ): Promise<MatsMethodDTO> {
    const method = await this.repository.findOne(methodId);

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

    await this.repository.save(method);

    if (!isImport) {
      await this.mpService.resetToNeedsEvaluation(locationId, userId);
    }

    return this.map.one(method);
  }

  async importMatsMethod(
    locationId: string,
    matsMethods: MatsMethodBaseDTO[],
    userId: string,
  ) {
    return new Promise(async resolve => {
      const promises = [];
      for (const matsMethod of matsMethods) {
        promises.push(
          new Promise(async innerResolve => {
            let method = await this.repository.getMatsMethodByLodIdParamCodeAndDate(
              locationId,
              matsMethod,
            );

            if (method) {
              await this.updateMethod(
                method.id,
                method.locationId,
                matsMethod,
                userId,
                true,
              );
            } else {
              await this.createMethod(locationId, matsMethod, userId, true);
            }

            innerResolve(true);
          }),
        );
      }

      await Promise.all(promises);
      resolve(true);
    });
  }
}
