import { Injectable } from '@nestjs/common';

import { UnitStackConfigurationWorkspaceRepository } from './unit-stack-configuration.repository';
import { EmissionEvaluationService } from '../emission-evaluation/emission-evaluation.service';
import { UnitStackConfigurationBaseDTO } from '../dtos/unit-stack-configuration.dto';
import { PlantService } from '../plant/plant.service';

@Injectable()
export class UnitStackConfigurationChecksService {
  constructor(
    private readonly repository: UnitStackConfigurationWorkspaceRepository,
    private readonly emissionEvaluationService: EmissionEvaluationService,
    private readonly plantService: PlantService,
  ) {}

  async runChecks(usc: UnitStackConfigurationBaseDTO, orisCode: number) {
    const errorList: string[] = [];

    const facilityId = await this.plantService.getFacIdFromOris(orisCode);
    const uscRecord = await this.repository.findOne({
      relations: {
        stackPipe: true,
        unit: true,
      },
      where: {
        beginDate: usc.beginDate,
        stackPipe: { facId: facilityId, name: usc.stackPipeId },
        unit: { facId: facilityId, name: usc.unitId },
      },
    });

    if (usc.endDate && new Date(usc.endDate) < new Date(usc.beginDate)) {
      errorList.push(
        `The End Date of the Unit Stack Configuration cannot be before the Begin Date`,
      );
    }

    if (uscRecord?.endDate && usc.endDate !== uscRecord.endDate) {
      console.log(
        `record end date: ${uscRecord.endDate}, usc end date: ${usc.endDate}`,
      );
      errorList.push(
        'Cannot update an existing End Date of a Unit Stack Configuration',
      );
    }

    const evaluations = await Promise.all([
      this.emissionEvaluationService.getLastEmissionEvaluationByUnitId(
        usc.unitId,
        facilityId,
      ),
      this.emissionEvaluationService.getLastEmissionEvaluationByStackPipeId(
        usc.stackPipeId,
        facilityId,
      ),
    ]);

    evaluations.forEach(evaluation => {
      if (!evaluation) return;

      if (
        usc.endDate &&
        new Date(usc.endDate) < new Date(evaluation.reportingPeriod.endDate)
      ) {
        errorList.push(
          'The End Date of the Unit Stack Configuration cannot be before the end date of the last Emission Evaluation for the Unit or Stack/Pipe.',
        );
      } else if (
        new Date(usc.beginDate) <= new Date(evaluation.reportingPeriod.endDate)
      ) {
        errorList.push(
          'The Begin Date for one or more Unit Stack Configuration records does not match the last official submission record for this monitoring plan. Please contact ECMPS Support if you need to correct the Begin Date for any Unit Stack Configuration records.',
        );
      }
    });

    return errorList;
  }
}
