import { BadRequestException } from '@nestjs/common';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';
import { ConnectionService } from '@us-epa-camd/easey-common/connection';

import { UpdateMonitorLocationDTO } from '../../dtos/monitor-location-update.dto';
import { UpdateMonitorPlanDTO } from '../../dtos/monitor-plan-update.dto';
import { SystemComponentBaseDTO } from '../../dtos/system-component.dto';
import { Plant } from '../../entities/plant.entity';
import { MonitorLocation } from '../../entities/workspace/monitor-location.entity';
import { StackPipe } from '../../entities/workspace/stack-pipe.entity';
import { Unit } from '../../entities/workspace/unit.entity';

export const getEntityManager = () => {
  return ConnectionService.getEntityManager();
};

export const getMonLocId = async (
  loc: UpdateMonitorLocationDTO,
  facility: number,
  oris: number,
): Promise<MonitorLocation> => {
  const entityManager = getEntityManager();

  let monLoc;
  if (loc.stackPipeId !== null) {
    const stackPipe = await entityManager.findOneBy(StackPipe, {
      name: loc.stackPipeId,
      facId: facility,
    });

    if (stackPipe === undefined) {
      throw new BadRequestException(
        CheckCatalogService.formatMessage(
          'The database does not contain a record for Stack Pipe [stackPipe] and Facility: [orisCode]',
          { stackPipe: loc.stackPipeId, orisCode: oris },
        ),
      );
    }

    monLoc = await entityManager.findOneBy(MonitorLocation, {
      stackPipeId: stackPipe.id,
    });
  } else {
    const unit = await entityManager.findOneBy(Unit, {
      name: loc.unitId,
      facId: facility,
    });

    if (unit === undefined) {
      throw new BadRequestException(
        CheckCatalogService.formatMessage(
          'The database does not contain a record for Unit [unit] and Facility: [orisCode]',
          { unit: loc.unitId, orisCode: oris },
        ),
      );
    }

    monLoc = await entityManager.findOneBy(MonitorLocation, {
      unitId: unit.id,
    });
  }

  return monLoc;
};

export const getFacIdFromOris = async (orisCode: number): Promise<number> => {
  const entityManager = getEntityManager();

  const facResult: Plant = await entityManager.findOneBy(Plant, {
    orisCode,
  });

  if (facResult === undefined) {
    return null;
  }

  return facResult.id;
};

export const checkComponentExistanceInFile = (
  monPlan: UpdateMonitorPlanDTO,
  systemComponent: SystemComponentBaseDTO,
) => {
  const results = [];
  for (const loc of monPlan.monitoringLocationData) {
    for (const component of loc.componentData) {
      if (component.componentId !== systemComponent.componentId) {
        results.push(false);
      } else {
        results.push(true);
      }
    }
  }

  if (results.includes(true)) {
    return true;
  }
  return false;
};
