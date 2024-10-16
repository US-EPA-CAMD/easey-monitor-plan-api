import { Injectable } from '@nestjs/common';

import { PlantRepository } from './plant.repository';

@Injectable()
export class PlantService {
  constructor(private readonly repository: PlantRepository) {}

  public async runPlantCheck(orisCode: number): Promise<string[]> {
    const errorList: string[] = [];

    if (!(await this.getFacIdFromOris(orisCode))) {
      errorList.push(
        `[IMPORT1-FATAL-A] The database doesn't contain any Facility with Oris Code ${orisCode}`,
      );
    }

    return errorList;
  }

  public async getFacIdFromOris(orisCode: number): Promise<number> {
    const plant = await this.repository.findOneBy({ orisCode: orisCode });

    if (plant) {
      return plant.id;
    }

    return null;
  }

  public async getOrisCodeFromFacId(facId: number): Promise<number> {
    const plant = await this.repository.findOneBy({ id: facId });

    if (plant) {
      return plant.orisCode;
    }

    return null;
  }
}
