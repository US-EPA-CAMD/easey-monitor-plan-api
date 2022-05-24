import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { UnitStackConfigurationWorkspaceRepository } from './unit-stack-configuration.repository';
import { UnitStackConfigurationMap } from '../maps/unit-stack-configuration.map';
import { UnitStackConfigurationBaseDTO } from '../dtos/unit-stack-configuration.dto';
import { UpdateMonitorPlanDTO } from '../dtos/monitor-plan-update.dto';
import { UnitService } from '../unit/unit.service';
import { StackPipeService } from '../stack-pipe/stack-pipe.service';

@Injectable()
export class UnitStackConfigurationWorkspaceService {
  constructor(
    private readonly repository: UnitStackConfigurationWorkspaceRepository,
    private readonly unitServive: UnitService,
    private readonly stackPipeService: StackPipeService,
    private readonly map: UnitStackConfigurationMap,
  ) {}

  async importUnitStack(
    plan: UpdateMonitorPlanDTO,
    facilityId: number,
    userId: string,
  ) {
    return new Promise(async resolve => {
      const promises = [];
      for (const unitStackConfig of plan.unitStackConfiguration) {
        promises.push(
          new Promise(async innerResolve => {
            const stackPipe = await this.stackPipeService.getStackByNameAndFacId(
              unitStackConfig.stackPipeId,
              facilityId,
            );

            const unit = await this.unitServive.getUnitByNameAndFacId(
              unitStackConfig.unitId,
              facilityId,
            );

            const unitStackConfigRecord = await this.repository.getUnitStackByUnitIdStackIdBDate(
              unit.id,
              stackPipe.id,
              unitStackConfig.beginDate,
            );

            if (unitStackConfigRecord !== undefined) {
              await this.updateUnitStackConfig(
                unitStackConfigRecord.id,
                unitStackConfig,
                userId,
              );
            } else {
              await this.createUnitStackConfig(
                unit.id,
                stackPipe.id,
                unitStackConfig,
                userId,
              );
            }
            innerResolve(true);
          }),
        );
      }
      await Promise.all(promises);
      resolve(true);
    });
  }

  async getUnitStackRelationships(hasUnit: boolean, id: string) {
    let relationship: any;

    if (hasUnit) {
      relationship = await this.repository.find({
        unitId: +id,
      });
    } else {
      relationship = await this.repository.find({
        where: {
          stackPipeId: id,
        },
        order: {
          unitId: 'ASC',
        },
      });
    }

    return this.map.many(relationship);
  }

  async createUnitStackConfig(
    unitRecordId: number,
    stackPipeRecordId: string,
    payload: UnitStackConfigurationBaseDTO,
    userId: string,
  ) {
    const unitStackConfig = this.repository.create({
      id: uuid(),
      unitId: unitRecordId,
      stackPipeId: stackPipeRecordId,
      beginDate: payload.beginDate,
      endDate: payload.endDate,
      addDate: new Date(Date.now()),
      updateDate: new Date(Date.now()),
      userId,
    });

    await this.repository.save(unitStackConfig);
    return this.map.one(unitStackConfig);
  }

  async updateUnitStackConfig(
    id: string,
    payload: UnitStackConfigurationBaseDTO,
    userId: string,
  ) {
    const unitStackConfig = await this.repository.getUnitStackById(id);

    unitStackConfig.endDate = payload.endDate;
    unitStackConfig.userId = userId;
    unitStackConfig.updateDate = new Date(Date.now());

    await this.repository.save(unitStackConfig);
    return this.map.one(unitStackConfig);
  }
}
