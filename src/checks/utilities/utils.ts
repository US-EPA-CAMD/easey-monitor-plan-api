import { UpdateMonitorLocationDTO } from '../../dtos/monitor-location-update.dto';
import { MonitorLocation } from '../../entities/workspace/monitor-location.entity';
import { StackPipe } from '../../entities/workspace/stack-pipe.entity';
import { Unit } from '../../entities/workspace/unit.entity';
import { getManager } from 'typeorm';
import { Plant } from '../../entities/plant.entity';

export const getEntityManager: any = () => {
  return getManager();
};

export const getMonLocId = async (
  loc: UpdateMonitorLocationDTO,
  facility: number,
): Promise<MonitorLocation> => {
  const entityManager = getEntityManager();

  let monLoc;
  if (loc.stackPipeId !== null) {
    const stackPipe = await entityManager.findOne(StackPipe, {
      name: loc.stackPipeId,
      facId: facility,
    });
    monLoc = await entityManager.findOne(MonitorLocation, {
      stackPipe: stackPipe.id,
    });
  } else {
    const unit = await entityManager.findOne(Unit, {
      name: loc.unitId,
      facId: facility,
    });
    monLoc = await entityManager.findOne(MonitorLocation, {
      unit: unit.id,
    });
  }

  return monLoc;
};

export const getFacIdFromOris = async (orisCode: number): Promise<number> => {
  const entityManager = getEntityManager();

  const facResult = await entityManager.findOne(Plant, {
    orisCode: orisCode,
  });

  if (facResult === undefined) {
    return null;
  } else {
    return facResult.id;
  }
};
