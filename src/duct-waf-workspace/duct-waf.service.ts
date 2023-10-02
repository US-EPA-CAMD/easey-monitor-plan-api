import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuid } from 'uuid';
import { DuctWafBaseDTO, DuctWafDTO } from '../dtos/duct-waf.dto';
import { DuctWafMap } from '../maps/duct-waf.map';
import { DuctWaf } from '../entities/duct-waf.entity';
import { DuctWafWorkspaceRepository } from './duct-waf.repository';
import { MonitorPlanWorkspaceService } from '../monitor-plan-workspace/monitor-plan.service';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { currentDateTime } from '@us-epa-camd/easey-common/utilities/functions';

@Injectable()
export class DuctWafWorkspaceService {
  constructor(
    @InjectRepository(DuctWafWorkspaceRepository)
    private readonly repository: DuctWafWorkspaceRepository,
    private readonly map: DuctWafMap,

    @Inject(forwardRef(() => MonitorPlanWorkspaceService))
    private readonly mpService: MonitorPlanWorkspaceService,
  ) {}

  async getDuctWafs(locationId: string): Promise<DuctWafDTO[]> {
    const results = await this.repository.find({ locationId });
    return this.map.many(results);
  }

  async getDuctWaf(id: string): Promise<DuctWaf> {
    const result = await this.repository.findOne(id);

    if (!result) {
      throw new EaseyException(
        new Error('Duct Waf Not Found'),
        HttpStatus.NOT_FOUND,
        {
          id: id,
        },
      );
    }

    return result;
  }

  async createDuctWaf(
    locationId: string,
    payload: DuctWafBaseDTO,
    userId: string,
    isImport = false,
  ): Promise<DuctWafDTO> {
    const ductWaf = this.repository.create({
      id: uuid(),
      locationId,
      wafDeterminationDate: payload.wafDeterminationDate,
      wafBeginDate: payload.wafBeginDate,
      wafBeginHour: payload.wafBeginHour,
      wafMethodCode: payload.wafMethodCode,
      wafValue: payload.wafValue,
      numberOfTestRuns: payload.numberOfTestRuns,
      numberOfTraversePointsWaf: payload.numberOfTraversePointsRef,
      numberOfTestPorts: payload.numberOfTestPorts,
      numberOfTraversePointsRef: payload.numberOfTraversePointsRef,
      ductWidth: payload.ductWidth,
      ductDepth: payload.ductDepth,
      wafEndDate: payload.wafEndDate,
      wafEndHour: payload.wafEndHour,
      userId: userId,
      addDate: currentDateTime(),
      updateDate: currentDateTime(),
    });

    await this.repository.save(ductWaf);

    if (!isImport) {
      await this.mpService.resetToNeedsEvaluation(locationId, userId);
    }

    return this.map.one(ductWaf);
  }

  async updateDuctWaf(
    locationId: string,
    ductWafId: string,
    payload: DuctWafBaseDTO,
    userId: string,
    isImport = false,
  ): Promise<DuctWafDTO> {
    const ductWaf = await this.getDuctWaf(ductWafId);

    ductWaf.wafDeterminationDate = payload.wafDeterminationDate;
    ductWaf.wafBeginDate = payload.wafBeginDate;
    ductWaf.wafBeginHour = payload.wafBeginHour;
    ductWaf.wafMethodCode = payload.wafMethodCode;
    ductWaf.wafValue = payload.wafValue;
    ductWaf.numberOfTestRuns = payload.numberOfTestRuns;
    ductWaf.numberOfTraversePointsWaf = payload.numberOfTraversePointsWaf;
    ductWaf.numberOfTestPorts = payload.numberOfTestPorts;
    ductWaf.numberOfTraversePointsRef = payload.numberOfTraversePointsRef;
    ductWaf.ductWidth = payload.ductWidth;
    ductWaf.ductDepth = payload.ductDepth;
    ductWaf.wafEndDate = payload.wafEndDate;
    ductWaf.wafEndHour = payload.wafEndHour;
    ductWaf.userId = userId;
    ductWaf.updateDate = currentDateTime();

    await this.repository.save(ductWaf);

    if (!isImport) {
      await this.mpService.resetToNeedsEvaluation(locationId, userId);
    }

    return this.map.one(ductWaf);
  }

  async importDuctWaf(
    locationId: string,
    ductWafs: DuctWafBaseDTO[],
    userId: string,
  ) {
    return new Promise(resolve => {
      (async () => {
        const promises = [];

        for (const ductWaf of ductWafs) {
          promises.push(
            new Promise(innerResolve => {
              (async () => {
                const ductWafRecord = await this.repository.getDuctWafByLocIdBDateBHourWafValue(
                  locationId,
                  ductWaf.wafBeginDate,
                  ductWaf.wafBeginHour,
                  ductWaf.wafEndDate,
                  ductWaf.wafEndHour,
                );

                if (ductWafRecord !== undefined) {
                  await this.updateDuctWaf(
                    locationId,
                    ductWafRecord.id,
                    ductWaf,
                    userId,
                    true,
                  );
                } else {
                  await this.createDuctWaf(locationId, ductWaf, userId, true);
                }

                innerResolve(true);
              })()
            }),
          );

          await Promise.all(promises);
          resolve(true);
        }
      })()
    });
  }
}
