import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { currentDateTime } from '@us-epa-camd/easey-common/utilities/functions';
import { EntityManager } from 'typeorm';
import { v4 as uuid } from 'uuid';

import { DuctWafBaseDTO, DuctWafDTO } from '../dtos/duct-waf.dto';
import { DuctWaf } from '../entities/duct-waf.entity';
import { DuctWafMap } from '../maps/duct-waf.map';
import { MonitorPlanWorkspaceService } from '../monitor-plan-workspace/monitor-plan.service';
import { withTransaction } from '../utils';
import { DuctWafWorkspaceRepository } from './duct-waf.repository';

@Injectable()
export class DuctWafWorkspaceService {
  constructor(
    private readonly repository: DuctWafWorkspaceRepository,
    private readonly map: DuctWafMap,

    @Inject(forwardRef(() => MonitorPlanWorkspaceService))
    private readonly mpService: MonitorPlanWorkspaceService,
  ) {}

  async getDuctWafs(locationId: string): Promise<DuctWafDTO[]> {
    const results = await this.repository.findBy({ locationId });
    return this.map.many(results);
  }

  async getDuctWaf(id: string, trx?: EntityManager): Promise<DuctWaf> {
    const result = await withTransaction(this.repository, trx).findOneBy({
      id,
    });

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

  async createDuctWaf({
    locationId,
    payload,
    userId,
    isImport = false,
    trx,
  }: {
    locationId: string;
    payload: DuctWafBaseDTO;
    userId: string;
    isImport?: boolean;
    trx?: EntityManager;
  }): Promise<DuctWafDTO> {
    const repository = withTransaction(this.repository, trx);

    const ductWaf = repository.create({
      id: uuid(),
      locationId,
      wafDeterminationDate: payload.wafDeterminationDate,
      wafBeginDate: payload.wafBeginDate,
      wafBeginHour: payload.wafBeginHour,
      wafMethodCode: payload.wafMethodCode,
      wafValue: payload.wafValue,
      numberOfTestRuns: payload.numberOfTestRuns,
      numberOfTraversePointsWaf: payload.numberOfTraversePointsWaf,
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

    await repository.save(ductWaf);

    if (!isImport) {
      await this.mpService.resetToNeedsEvaluation(locationId, userId, trx);
    }

    return this.map.one(ductWaf);
  }

  async updateDuctWaf({
    locationId,
    ductWafId,
    payload,
    userId,
    isImport = false,
    trx,
  }: {
    locationId: string;
    ductWafId: string;
    payload: DuctWafBaseDTO;
    userId: string;
    isImport?: boolean;
    trx?: EntityManager;
  }): Promise<DuctWafDTO> {
    const ductWaf = await this.getDuctWaf(ductWafId, trx);

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

    await withTransaction(this.repository, trx).save(ductWaf);

    if (!isImport) {
      await this.mpService.resetToNeedsEvaluation(locationId, userId, trx);
    }

    return this.map.one(ductWaf);
  }

  async importDuctWaf(
    locationId: string,
    ductWafs: DuctWafBaseDTO[],
    userId: string,
    trx?: EntityManager,
  ) {
    return new Promise(resolve => {
      (async () => {
        const promises = [];

        for (const ductWaf of ductWafs) {
          promises.push(
            new Promise(innerResolve => {
              (async () => {
                const ductWafRecord = await withTransaction(
                  this.repository,
                  trx,
                ).getDuctWafByLocIdBDateBHourWafValue(
                  locationId,
                  ductWaf.wafBeginDate,
                  ductWaf.wafBeginHour,
                  ductWaf.wafEndDate,
                  ductWaf.wafEndHour,
                );

                if (ductWafRecord) {
                  await this.updateDuctWaf({
                    locationId,
                    ductWafId: ductWafRecord.id,
                    payload: ductWaf,
                    userId,
                    isImport: true,
                    trx,
                  });
                } else {
                  await this.createDuctWaf({
                    locationId,
                    payload: ductWaf,
                    userId,
                    isImport: true,
                    trx,
                  });
                }

                innerResolve(true);
              })();
            }),
          );

          await Promise.all(promises);
          resolve(true);
        }
      })();
    });
  }
}
