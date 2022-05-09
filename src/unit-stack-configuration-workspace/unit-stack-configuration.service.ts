import { Injectable } from '@nestjs/common';
import { UnitStackConfigurationWorkspaceRepository } from './unit-stack-configuration.repository';
import { UnitStackConfigurationMap } from '../maps/unit-stack-configuration.map';
import { UpdateMonitorPlanDTO } from '../dtos/monitor-plan-update.dto';
import { UnitService } from '../unit/unit.service';
import { UnitStackConfiguration } from '../entities/workspace/unit-stack-configuration.entity';
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
  ): Promise<any[]> {
    const promises = [];
    for (const unitStackConfig of plan.unitStackConfiguration) {
      promises.push(
        new Promise(async (resolve, reject) => {
          const stackPipe = await this.stackPipeService.getStackByNameAndFacId(
            unitStackConfig.stackPipeId,
            facilityId,
          );

          const unit = await this.unitServive.getUnitByNameAndFacId(
            unitStackConfig.unitId,
            facilityId,
          );

          const unitStackConfigRecord = await this.repository.findOne({
            where: { unitId: unit.id, stackPipeId: stackPipe.id },
          });

          if (unitStackConfigRecord !== undefined) {
            unitStackConfigRecord.updateDate = new Date();
            unitStackConfigRecord.beginDate = unitStackConfig.beginDate;
            unitStackConfigRecord.endDate = unitStackConfig.endDate;
            unitStackConfigRecord.userId = userId;

            await this.repository.update(
              unitStackConfigRecord,
              unitStackConfigRecord,
            );
          } else {
            const unitStack = new UnitStackConfiguration();
            unitStack.updateDate = new Date();
            unitStack.beginDate = unitStackConfig.beginDate;
            unitStack.endDate = unitStackConfig.endDate;
            unitStack.userId = userId;

            this.repository.create(unitStack);
          }
        }),
      );
    }

    return promises;
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
}
