import { UpdateMonitorLocationDTO } from '../../dtos/monitor-location-update.dto';
import { MonitorLocation } from '../../entities/workspace/monitor-location.entity';
import { StackPipe } from '../../entities/workspace/stack-pipe.entity';
import { Unit } from '../../entities/workspace/unit.entity';
import { getManager } from 'typeorm';
import { Plant } from '../../entities/plant.entity';
import { BadRequestException } from '@nestjs/common';
import { UpdateMonitorPlanDTO } from '../../dtos/monitor-plan-update.dto';
import { SystemComponentBaseDTO } from '../../dtos/system-component.dto';

export const getEntityManager: any = () => {
  return getManager();
};

export const getMonLocId = async (
  loc: UpdateMonitorLocationDTO,
  facility: number,
  oris: number,
): Promise<MonitorLocation> => {
  const entityManager = getEntityManager();

  let monLoc;
  if (loc.stackPipeId !== null) {
    const stackPipe = await entityManager.findOne(StackPipe, {
      name: loc.stackPipeId,
      facId: facility,
    });

    if (stackPipe === undefined) {
      throw new BadRequestException(
        `No stack pipe record exists for stackPipeName: ${loc.stackPipeId} and orisCode: ${oris}`,
      );
    }

    monLoc = await entityManager.findOne(MonitorLocation, {
      stackPipe: stackPipe.id,
    });
  } else {
    const unit = await entityManager.findOne(Unit, {
      name: loc.unitId,
      facId: facility,
    });

    if (unit === undefined) {
      throw new BadRequestException(
        `No stack pipe record exists for unitName: ${loc.unitId} and orisCode: ${oris}`,
      );
    }

    monLoc = await entityManager.findOne(MonitorLocation, {
      unit: unit.id,
    });
  }

  return monLoc;
};

export const getFacIdFromOris = async (orisCode: number): Promise<number> => {
  const entityManager = getEntityManager();

  const facResult: Plant = await entityManager.findOne(Plant, {
    orisCode: orisCode,
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
  for (const loc of monPlan.locations) {
    for (const component of loc.components) {
      if (
        component.componentId !== systemComponent.componentId &&
        component.componentTypeCode !== systemComponent.componentTypeCode
      ) {
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
