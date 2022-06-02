import { Injectable } from '@nestjs/common';
import { Unit } from '../entities/unit.entity';
import { PlantRepository } from './plant.repository';

@Injectable()
export class PlantService {
  constructor(private readonly repository: PlantRepository) {}

  public async getFacIdFromOris(orisCode: number): Promise<number> {
    const plant = await this.repository.findOne({ orisCode: orisCode });

    if (plant) {
      return plant.id;
    }

    return null;
  }
}
