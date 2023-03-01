import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { MonitorLocationWorkspaceService } from '../monitor-location-workspace/monitor-location.service';
import { PlantService } from '../plant/plant.service';
import { ComponentWorkspaceService } from '../component-workspace/component.service';
import { UpdateMonitorPlanDTO } from '../dtos/monitor-plan-update.dto';
import { MonitorQualificationWorkspaceService } from '../monitor-qualification-workspace/monitor-qualification.service';
import { MonitorSystemWorkspaceService } from '../monitor-system-workspace/monitor-system.service';
import { UnitService } from '../unit/unit.service';
import { UnitStackConfigurationWorkspaceService } from '../unit-stack-configuration-workspace/unit-stack-configuration.service';
import { MonitorFormulaWorkspaceService } from '../monitor-formula-workspace/monitor-formula.service';
import { MonitorSpanWorkspaceService } from '../monitor-span-workspace/monitor-span.service';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';
import { UnitControlChecksService } from '../unit-control-workspace/unit-control-checks.service';

@Injectable()
export class ImportChecksService {
  constructor(
    private readonly logger: Logger,
    private readonly componentService: ComponentWorkspaceService,
    private readonly qualificationService: MonitorQualificationWorkspaceService,
    private readonly monitorSystemService: MonitorSystemWorkspaceService,
    private readonly monitorLocationService: MonitorLocationWorkspaceService,
    private readonly unitService: UnitService,
    private readonly plantService: PlantService,
    private readonly unitStackService: UnitStackConfigurationWorkspaceService,
    private readonly formulaService: MonitorFormulaWorkspaceService,
    private readonly spanService: MonitorSpanWorkspaceService,
    private readonly unitControlChecksService: UnitControlChecksService,
  ) {}

  private checkIfThrows(errorList: string[]) {
    if (errorList.length > 0) {
      throw new LoggingException(errorList.toString(), HttpStatus.BAD_REQUEST);
    }
  }

  public async runImportChecks(monPlan: UpdateMonitorPlanDTO) {
    this.logger.info('Running import validation checks');
    let errorList = [];

    // Plant Check
    errorList.push(
      ...(await this.plantService.runPlantCheck(monPlan.orisCode)),
    );
    this.checkIfThrows(errorList);

    //TODO, needs to throw error here if non existing

    const facilityId = await this.plantService.getFacIdFromOris(
      monPlan.orisCode,
    );

    //Unit Stack Checks
    errorList.push(...this.unitStackService.runUnitStackChecks(monPlan));
    this.checkIfThrows(errorList);

    const databaseLocations = await this.monitorLocationService.getMonitorLocationsByFacilityAndOris(
      monPlan,
      facilityId,
      monPlan.orisCode,
    );

    let index = 0;
    for (const location of monPlan.locations) {
      // Unit Checks
      if (location.unitId) {
        errorList.push(
          ...(await this.unitService.runUnitChecks(
            location,
            monPlan.orisCode,
            facilityId,
          )),
        );
      }

      // Component Checks
      errorList.push(
        ...(await this.componentService.runComponentChecks(
          location.components,
          location,
          databaseLocations[index].id,
        )),
      );

      location.unitControls?.forEach(unitControl => {
        errorList.push(
          new Promise(async(resolve, _reject) => {
            const results = this.unitControlChecksService.runChecks(
              unitControl,
              location.unitId,
              databaseLocations[index].id,
              true,
              false,
              location,
            )
          }))
      })

      // Qualification Checks
      errorList.push(
        ...(await this.qualificationService.runQualificationImportCheck(
          location.qualifications,
        )),
      );

      // Monitor System Checks
      errorList.push(
        ...(await this.monitorSystemService.runMonitorSystemImportCheck(
          monPlan,
          location,
          databaseLocations[index].id,
          location.systems,
        )),
      );

      // Formula Checks
      errorList.push(
        ...(await this.formulaService.runFormulaChecks(
          location.formulas,
          location,
          databaseLocations[index].id,
        )),
      );

      // Span Checks
      errorList.push(...(await this.spanService.runSpanChecks(location.spans)));

      index++;
    }

    this.checkIfThrows(errorList);

    this.logger.info('Import validation checks ran successfully');
  }
}
