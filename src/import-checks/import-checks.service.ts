import { BadRequestException, Injectable } from '@nestjs/common';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { MonitorLocationWorkspaceService } from '../monitor-location-workspace/monitor-location.service';
import { PlantService } from '../plant/plant.service';
import { ComponentWorkspaceService } from '../component-workspace/component.service';
import { UpdateMonitorPlanDTO } from '../dtos/monitor-plan-update.dto';
import { UnitService } from '../unit/unit.service';
import { UnitStackConfigurationWorkspaceService } from '../unit-stack-configuration-workspace/unit-stack-configuration.service';

@Injectable()
export class ImportChecksService {
  constructor(
    private readonly logger: Logger,
    private readonly componentService: ComponentWorkspaceService,
    private readonly monitorLocationService: MonitorLocationWorkspaceService,
    private readonly unitService: UnitService,
    private readonly plantService: PlantService,
    private readonly unitStackService: UnitStackConfigurationWorkspaceService,
  ) {}

  private checkIfThrows(errorList: string[]) {
    if (errorList.length > 0) {
      this.logger.error(BadRequestException, errorList, true);
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

      index++;
    }

    this.checkIfThrows(errorList);

    this.logger.info('Import validation checks ran successfully');
  }
}
