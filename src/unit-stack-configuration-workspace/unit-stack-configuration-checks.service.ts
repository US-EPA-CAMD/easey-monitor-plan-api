import { Injectable } from '@nestjs/common';

import { UnitStackConfigurationWorkspaceRepository } from './unit-stack-configuration.repository';
import { EmissionEvaluationService } from '../emission-evaluation/emission-evaluation.service';
import { UnitStackConfigurationBaseDTO } from '../dtos/unit-stack-configuration.dto';

@Injectable()
export class UnitStackConfigurationChecksService {
  constructor(
    private readonly repository: UnitStackConfigurationWorkspaceRepository,
    private readonly emissionEvaluationService: EmissionEvaluationService,
  ) {}

  async runChecks(usc: UnitStackConfigurationBaseDTO) {
    const errorList: string[] = [];

    const uscRecord = await this.repository.findOne({
      relations: {
        stackPipe: true,
        unit: true,
      },
      where: {
        beginDate: usc.beginDate,
        stackPipe: { name: usc.stackPipeId },
        unit: { name: usc.unitId },
      },
    });

    const evaluations = await Promise.all([
      this.emissionEvaluationService.getLastEmissionEvaluationByUnitId(
        usc.unitId,
      ),
      this.emissionEvaluationService.getLastEmissionEvaluationByStackPipeId(
        usc.stackPipeId,
      ),
    ]);

    evaluations.forEach(evaluation => {
      if (!evaluation) return;

      if (
        uscRecord &&
        usc.endDate &&
        new Date(usc.endDate) < new Date(evaluation.reportingPeriod.endDate)
      ) {
        // Check the end date if the record exists.
        errorList.push(
          `The End Date of the Unit Stack Configuration cannot be before the end date of the last Emission Evaluation for the Unit or Stack/Pipe`,
        );
      } else if (!uscRecord) {
        // Check the begin date if the record does not yet exist.
        if (!usc.beginDate) {
          errorList.push(`The Unit Stack Configuration must have a Begin Date`);
        } else if (
          new Date(usc.beginDate) <=
          new Date(evaluation.reportingPeriod.endDate)
        ) {
          errorList.push(
            `The Begin Date of the Unit Stack Configuration cannot be on or before the end date of the last Emission Evaluation for the Unit or Stack/Pipe`,
          );
        }
      }
    });

    return errorList;
  }
}
