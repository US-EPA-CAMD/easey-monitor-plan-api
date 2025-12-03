import { Injectable } from '@nestjs/common';
import { currentDateTime } from '@us-epa-camd/easey-common/utilities/functions';
import { EntityManager } from 'typeorm';
import { v4 as uuid } from 'uuid';

import { UpdateMonitorPlanDTO } from '../dtos/monitor-plan-update.dto';
import {
  UnitStackConfigurationBaseDTO,
  UnitStackConfigurationDTO,
} from '../dtos/unit-stack-configuration.dto';
import { UnitMap } from '../maps/unit.map';
import { UnitStackConfigurationMap } from '../maps/unit-stack-configuration.map';
import { StackPipeWorkspaceService } from '../stack-pipe-workspace/stack-pipe.service';
import { UnitService } from '../unit/unit.service';
import { settlePromises, withTransaction } from '../utils';
import { UnitStackConfigurationWorkspaceRepository } from './unit-stack-configuration.repository';
import { CheckCatalogService } from '@us-epa-camd/easey-common';

const KEY = 'Unit Stack Configuration'

@Injectable()
export class UnitStackConfigurationWorkspaceService {
  constructor(
    private readonly repository: UnitStackConfigurationWorkspaceRepository,
    private readonly unitMap: UnitMap,
    private readonly unitService: UnitService,
    private readonly stackPipeService: StackPipeWorkspaceService,
    private readonly map: UnitStackConfigurationMap,
  ) { }

  async getUnitStackConfigsByIds(ids: string[], trx?: EntityManager) {
    const results = await withTransaction(
      this.repository,
      trx,
    ).getUnitStacksByIds(ids);
    return this.map.many(results);
  }

  async getUnitStackConfigurationsByFacId(facId: number, trx?: EntityManager) {
    const results = await withTransaction(this.repository, trx).find({
      relations: {
        stackPipe: true,
        unit: true,
      },
      where: [{ unit: { facId } }, { stackPipe: { facId } }],
    });
    return this.map.many(results);
  }

  async getUnitStackConfigsByMonitorPlanId(
    monitorPlanId: string,
    trx?: EntityManager,
  ) {
    const results = await withTransaction(
      this.repository,
      trx,
    ).getUnitStackConfigsByMonitorPlanId(monitorPlanId);
    return await this.map.many(results);
  }

  async getUnitStackConfigsByLocationIds(locationIds: string[]) {
    return await this.repository.getUnitStackConfigsByLocationIds(locationIds);
  }

  async runUnitStackChecks(monitorPlan: UpdateMonitorPlanDTO, facilityId: number): Promise<string[]> {
    const errorList: string[] = [];

    await this.validateUnitStackConfigs(monitorPlan, facilityId, errorList);
    this.validateConfigLocationRelationships(monitorPlan, errorList);
    this.validateStackUnitAssociations(monitorPlan, errorList);

    return errorList
  }

  private async validateUnitStackConfigs(
    monitorPlan: UpdateMonitorPlanDTO,
    facilityId: number,
    errorList: string[],
  ): Promise<void> {
    for (const unitStackConfig of monitorPlan.unitStackConfigurationData) {
      this.validateUnitStackConfig(unitStackConfig, errorList);

      if (unitStackConfig.unitId && unitStackConfig.stackPipeId) {
        const hasDuplicate = await this.checkDatabaseDuplicate(
          unitStackConfig,
          facilityId,
          errorList,
        );
        if (hasDuplicate) return;
      }
    }
  }
  private validateUnitStackConfig(
    config: UnitStackConfigurationBaseDTO,
    errorList: string[],
  ): void {
    if (!config.unitId) {
      const error = CheckCatalogService.formatResultMessage('MONLOC-107-A', {
        fieldname: 'unitId',
        key: KEY,
      });
      errorList.push(error);
    }
  }
  private async checkDatabaseDuplicate(
    config: UnitStackConfigurationBaseDTO,
    facilityId: number,
    errorList: string[],
  ): Promise<boolean> {

    const stackPipe = await this.stackPipeService.getStackByNameAndFacId(
      config.stackPipeId,
      facilityId,
    ).catch(() => null);

    if (!stackPipe) return false;

    const unit = await this.unitService.getUnitByNameAndFacId(
      config.unitId,
      facilityId,
    ).catch(() => null);
    if (!unit) return false;


    const existingConfig = await this.repository.getUnitStackConfigByUnitIdStackId(
      unit.id,
      stackPipe.id,
    ).catch(() => null);

    if (existingConfig) {
      const error = CheckCatalogService.formatResultMessage('MONLOC-107-B', {
        recordtype: KEY,
        fieldnames: 'unitId, stackPipeId',
      });
      errorList.push(error);
      return true;
    }

    return false;
  }
  private validateConfigLocationRelationships(
    monitorPlan: UpdateMonitorPlanDTO,
    errorList: string[],
  ): void {
    const { unitStackIds, unitUnitIds } = this.extractLocationIds(monitorPlan);

    for (const unitStackConfig of monitorPlan.unitStackConfigurationData) {
      this.validateConfigReferences(unitStackConfig, unitStackIds, unitUnitIds, errorList);
    }
  }

  private validateConfigReferences(
    config: UnitStackConfigurationBaseDTO,
    unitStackIds: Set<string>,
    unitUnitIds: Set<string>,
    errorList: string[],
  ): void {
    if (!unitStackIds.has(config.stackPipeId)) {
      errorList.push(
        `[IMPORT8-CRIT1-A] Each Stack/Pipe and Unit in a unit stack configuration record must be linked to unit and stack/pipe records that are also present in the file. StackPipeID ${config.stackPipeId} was not associated with a Stack/Pipe record in the file.`,
      );
    }

    if (!unitUnitIds.has(config.unitId)) {
      errorList.push(
        `[IMPORT8-CRIT1-B] Each Stack/Pipe and Unit in a unit stack configuration record must be linked to unit and stack/pipe records that are also present in the file. UnitID ${config.unitId} was not associated with a Unit record in the file. This StackPipe Configuration Record was not imported.`,
      );
    }
  }

  private validateStackUnitAssociations(
    monitorPlan: UpdateMonitorPlanDTO,
    errorList: string[],
  ): void {
    const unitStackIds = this.extractStackIdsFromLocations(monitorPlan);
    const unitStackConfigStackIds = this.extractStackIdsFromConfigs(monitorPlan);

    for (const stackPipe of unitStackIds) {
      if (!unitStackConfigStackIds.has(stackPipe)) {
        errorList.push(
          `[IMPORT3-FATAL-A] Each stack or pipe must be associated with at least one unit. StackName ${stackPipe} is not associated with any units.`,
        );
      }
    }
  }

  private extractStackIdsFromLocations(monitorPlan: UpdateMonitorPlanDTO): Set<string> {
    const unitStackIds: Set<string> = new Set<string>();

    for (const location of monitorPlan.monitoringLocationData) {
      if (location.stackPipeId) {
        unitStackIds.add(location.stackPipeId);
      }
    }

    return unitStackIds;
  }

  private extractStackIdsFromConfigs(monitorPlan: UpdateMonitorPlanDTO): Set<string> {
    const unitStackConfigStackIds: Set<string> = new Set<string>();

    for (const unitStackConfig of monitorPlan.unitStackConfigurationData) {
      if (unitStackConfig.stackPipeId) {
        unitStackConfigStackIds.add(unitStackConfig.stackPipeId);
      }
    }

    return unitStackConfigStackIds;
  }

  private extractLocationIds(monitorPlan: UpdateMonitorPlanDTO): {
    unitStackIds: Set<string>;
    unitUnitIds: Set<string>;
  } {
    const unitStackIds: Set<string> = new Set<string>();
    const unitUnitIds: Set<string> = new Set<string>();

    for (const location of monitorPlan.monitoringLocationData) {
      if (location.stackPipeId) {
        unitStackIds.add(location.stackPipeId);
      }
      if (location.unitId) {
        unitUnitIds.add(location.unitId);
      }
    }

    return { unitStackIds, unitUnitIds };
  }

  async importUnitStackConfigurationChecks(monPlan: UpdateMonitorPlanDTO): Promise<string[]> {
    const errorList: string[] = [];

    const unitIds = new Set(
      monPlan.monitoringLocationData
        .filter(loc => loc.unitId)
        .map(loc => loc.unitId)
    );
    if (unitIds.size > 1) {
      for (const unitId of unitIds) {
        const hasStackConfig = monPlan.unitStackConfigurationData?.some(
          config => config.unitId === unitId
        );
        if (!hasStackConfig) {
          const error = CheckCatalogService.formatResultMessage('IMPORT-4-A', {
            fieldname: 'unitId',
            unitId
          })
          errorList.push(error)
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

    await settlePromises(
      plan.unitStackConfigurationData.map(async unitStackConfig => {
        const stackPipe = await this.stackPipeService.getStackByNameAndFacId(
          unitStackConfig.stackPipeId,
          facilityId,
          trx,
        );

        const unit = await this.unitService.getUnitByNameAndFacId(
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
      userId,
    });

    await repository.save(unitStackConfig);
    return this.map.one(unitStackConfig);
  }

  /**
   * Synchronizes the end date of unit stack configurations with the end date of the unit or stack pipe.
   */
  async syncFacilityUnitStackConfigs(
    facId: number,
    userId: string,
    trx?: EntityManager,
  ) {
    const uscs = await withTransaction(this.repository, trx).find({
      relations: {
        stackPipe: true,
        unit: {
          opStatuses: true,
        },
      },
      where: [{ unit: { facId } }, { stackPipe: { facId } }],
    });

    for (const usc of uscs) {
      const unitDto = await this.unitMap.one(usc.unit);
      if ((unitDto.endDate || usc.stackPipe.retireDate) && !usc.endDate) {
        const newEndDate = new Date(
          Math.min(
            unitDto.endDate?.getTime() ?? Infinity,
            usc.stackPipe.retireDate?.getTime() ?? Infinity,
          ),
        );
        usc.endDate = newEndDate;
        usc.updateDate = currentDateTime();
        usc.userId = userId;
        await withTransaction(this.repository, trx).save(usc);
      }
    }
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
