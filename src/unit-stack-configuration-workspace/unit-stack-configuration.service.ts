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

  runUnitStackChecks(monitorPlan: UpdateMonitorPlanDTO): string[] {
    const errorList: string[] = [];

    const unitStackIds: Set<string> = new Set<string>(); // Set for faster look up times
    const unitUnitIds: Set<string> = new Set<string>();

    const unitStackConfigStackIds: Set<string> = new Set<string>();
    const unitStackConfigUnitIds: Set<string> = new Set<string>();

    for (const location of monitorPlan.locations) {
      unitStackIds.add(location.stackPipeId);
      unitUnitIds.add(location.unitId);
    }

    for (const unitStack of monitorPlan.unitStackConfiguration) {
      if (!unitStackIds.has(unitStack.stackPipeId)) {
        errorList.push(
          `[IMPORT8-CRIT1-A] Each Stack/Pipe and Unit in a unit stack configuration record must be linked to unit and stack/pipe records that are also present in the file. StackPipeID ${unitStack.stackPipeId} was not associated with a Stack/Pipe record in the file.`,
        );
      }

      if (!unitUnitIds.has(unitStack.unitId)) {
        errorList.push(
          `[IMPORT8-CRIT1-B] Each Stack/Pipe and Unit in a unit stack configuration record must be linked to unit and stack/pipe records that are also present in the file. UnitID ${unitStack.unitId} was not associated with a Unit record in the file. This StackPipe Configuration Record was not imported.`,
        );
      }

      unitStackConfigStackIds.add(unitStack.stackPipeId);
      unitStackConfigUnitIds.add(unitStack.unitId);
    }

    for (const stackPipe of unitStackIds) {
      if (!unitStackConfigStackIds.has(stackPipe)) {
        errorList.push(
          `[IMPORT3-FATAL-A] Each stack or pipe must be associated with at least one unit. StackName ${stackPipe} is not associated with any units.`,
        );
      }
    }

    if (unitUnitIds.size > 1) {
      for (const unitId of unitUnitIds) {
        if (!unitStackConfigUnitIds.has(unitId)) {
          errorList.push(
            `[IMPORT4-FATAL-A] Each unit must be associated with at least one unit record. Unit Name ${unitId} is not associated with any unit record`,
          );
        }
      }
    }

    return errorList;
  }

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
