import { Injectable } from '@nestjs/common';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';
import { currentDateTime } from '@us-epa-camd/easey-common/utilities/functions';
import { EntityManager } from 'typeorm';
import { v4 as uuid } from 'uuid';

import { UpdateMonitorPlanDTO } from '../dtos/monitor-plan-update.dto';
import {
  UnitStackConfigurationBaseDTO,
  UnitStackConfigurationDTO,
} from '../dtos/unit-stack-configuration.dto';
import { UnitStackConfigurationMap } from '../maps/unit-stack-configuration.map';
import { StackPipeWorkspaceService } from '../stack-pipe-workspace/stack-pipe.service';
import { UnitService } from '../unit/unit.service';
import { withTransaction } from '../utils';
import { UnitStackConfigurationWorkspaceRepository } from './unit-stack-configuration.repository';

@Injectable()
export class UnitStackConfigurationWorkspaceService {
  constructor(
    private readonly repository: UnitStackConfigurationWorkspaceRepository,
    private readonly unitServive: UnitService,
    private readonly stackPipeService: StackPipeWorkspaceService,
    private readonly map: UnitStackConfigurationMap,
  ) {}

  async getUnitStackConfigsByIds(ids: string[], trx?: EntityManager) {
    const results = await withTransaction(
      this.repository,
      trx,
    ).getUnitStacksByIds(ids);
    return this.map.many(results);
  }

  async getUnitStackConfigsByLocationIds(locationIds: string[]) {
    return await this.repository.getUnitStackConfigsByLocationIds(locationIds);
  }

  runUnitStackChecks(monitorPlan: UpdateMonitorPlanDTO): string[] {
    const errorList: string[] = [];

    const unitStackIds: Set<string> = new Set<string>(); // Set for faster look up times
    const unitUnitIds: Set<string> = new Set<string>();

    const unitStackConfigStackIds: Set<string> = new Set<string>();
    const unitStackConfigUnitIds: Set<string> = new Set<string>();

    for (const location of monitorPlan.monitoringLocationData) {
      if (location.stackPipeId) {
        unitStackIds.add(location.stackPipeId);
      }
      if (location.unitId) {
        unitUnitIds.add(location.unitId);
      }
    }

    for (const unitStackConfig of monitorPlan.unitStackConfigurationData) {
      if (!unitStackIds.has(unitStackConfig.stackPipeId)) {
        errorList.push(
          `[IMPORT8-CRIT1-A] Each Stack/Pipe and Unit in a unit stack configuration record must be linked to unit and stack/pipe records that are also present in the file. StackPipeID ${unitStackConfig.stackPipeId} was not associated with a Stack/Pipe record in the file.`,
        );
      }

      if (!unitUnitIds.has(unitStackConfig.unitId)) {
        errorList.push(
          `[IMPORT8-CRIT1-B] Each Stack/Pipe and Unit in a unit stack configuration record must be linked to unit and stack/pipe records that are also present in the file. UnitID ${unitStackConfig.unitId} was not associated with a Unit record in the file. This StackPipe Configuration Record was not imported.`,
        );
      }

      unitStackConfigStackIds.add(unitStackConfig.stackPipeId);
      unitStackConfigUnitIds.add(unitStackConfig.unitId);
    }

    for (const stackPipe of unitStackIds) {
      if (!unitStackConfigStackIds.has(stackPipe)) {
        errorList.push(
          //CheckCatalogService.formatResultMessage('IMPORT-3-A', { stackName: stackPipe }),
          `[IMPORT3-FATAL-A] Each stack or pipe must be associated with at least one unit. StackName ${stackPipe} is not associated with any units.`,
        );
      }
    }

    if (unitUnitIds.size > 1) {
      for (const unitId of unitUnitIds) {
        if (!unitStackConfigUnitIds.has(unitId)) {
          errorList.push(
            CheckCatalogService.formatResultMessage('IMPORT-4-A', {
              unitId: unitId,
            }),
          );
        }
      }
    }

    return errorList;
  }

  async importUnitStacks(
    plan: UpdateMonitorPlanDTO,
    facilityId: number,
    userId: string,
    trx?: EntityManager,
  ) {
    const unitStackConfigDTOs: UnitStackConfigurationDTO[] = [];

    await Promise.all(
      plan.unitStackConfigurationData.map(async unitStackConfig => {
        const stackPipe = await this.stackPipeService.getStackByNameAndFacId(
          unitStackConfig.stackPipeId,
          facilityId,
          trx,
        );

        const unit = await this.unitServive.getUnitByNameAndFacId(
          unitStackConfig.unitId,
          facilityId,
          trx,
        );

        const unitStackConfigRecord = await withTransaction(
          this.repository,
          trx,
        ).getUnitStackConfigByUnitIdStackId(unit.id, stackPipe.id);

        const unitStackConfigDTO = unitStackConfigRecord
          ? await this.updateUnitStackConfig(
              unitStackConfigRecord.id,
              unitStackConfig,
              userId,
              trx,
            )
          : await this.createUnitStackConfig(
              unit.id,
              stackPipe.id,
              unitStackConfig,
              userId,
              trx,
            );

        unitStackConfigDTOs.push(unitStackConfigDTO);
      }),
    );

    return unitStackConfigDTOs;
  }

  async getUnitStackRelationships(id: string | number, isUnit: boolean) {
    const relationship = await this.repository.getUnitStackConfigsByUnitId(
      id,
      isUnit,
    );

    return this.map.many(relationship);
  }

  async createUnitStackConfig(
    unitRecordId: number,
    stackPipeRecordId: string,
    payload: UnitStackConfigurationBaseDTO,
    userId: string,
    trx?: EntityManager,
  ) {
    const repository = withTransaction(this.repository, trx);

    const unitStackConfig = repository.create({
      id: uuid(),
      unitId: unitRecordId,
      stackPipeId: stackPipeRecordId,
      beginDate: payload.beginDate,
      endDate: payload.endDate,
      addDate: currentDateTime(),
      updateDate: currentDateTime(),
      userId,
    });

    await repository.save(unitStackConfig);
    return this.map.one(unitStackConfig);
  }

  async updateUnitStackConfig(
    id: string,
    payload: UnitStackConfigurationBaseDTO,
    userId: string,
    trx?: EntityManager,
  ) {
    const repository = withTransaction(this.repository, trx);

    const unitStackConfig = await repository.getUnitStackById(id);

    unitStackConfig.endDate = payload.endDate;
    unitStackConfig.userId = userId;
    unitStackConfig.updateDate = currentDateTime();

    await repository.save(unitStackConfig);
    return this.map.one(unitStackConfig);
  }
}
