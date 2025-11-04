import { Injectable } from '@nestjs/common';
import { CheckCatalogService } from '@us-epa-camd/easey-common';

import { PlantRepository } from './plant.repository';
import { UpdateMonitorPlanDTO } from '../dtos/monitor-plan-update.dto';


@Injectable()
export class PlantService {
  constructor(private readonly repository: PlantRepository) { }

  public async runPlantCheck(orisCode: number): Promise<string[]> {
    const errorList: string[] = [];

    if (!(await this.getFacIdFromOris(orisCode))) {
      errorList.push(
        `[IMPORT1-FATAL-A] The database doesn't contain any Facility with Oris Code ${orisCode}`,
      );
    }

    return errorList;
  }

  public async runImport1Checks(monPlan: UpdateMonitorPlanDTO, facilityId: number): Promise<string[]> {
    const errorList: string[] = [];
    const { orisCode } = monPlan;

    // IMPORT-1-A: Check if ORIS code exists in database
    if (!facilityId) {
      errorList.push(CheckCatalogService.formatResultMessage('IMPORT-1-A', {
        fieldname: 'orisCode',
        orisCode: orisCode
      }));
    }

    // IMPORT-1-B: Check if there are units in the file
    const unitCount = monPlan.monitoringLocationData.filter(loc => loc.unitId).length;
    if (unitCount === 0) {
      errorList.push(CheckCatalogService.formatResultMessage('IMPORT-1-B'));
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
