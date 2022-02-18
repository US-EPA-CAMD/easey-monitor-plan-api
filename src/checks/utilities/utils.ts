import { getManager } from 'typeorm';
import { Plant } from '../../entities/plant.entity';

export const getEntityManager: any = () => {
  return getManager();
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
