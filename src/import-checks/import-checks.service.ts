import { HttpStatus, Injectable } from '@nestjs/common';
import { MonitorLocationWorkspaceService } from '../monitor-location-workspace/monitor-location.service';
import { PlantService } from '../plant/plant.service';
import { ComponentWorkspaceService } from '../component-workspace/component.service';
import { UpdateMonitorPlanDTO } from '../dtos/monitor-plan-update.dto';
import { MonitorQualificationWorkspaceService } from '../monitor-qualification-workspace/monitor-qualification.service';
import { MonitorSystemWorkspaceService } from '../monitor-system-workspace/monitor-system.service';
import { UnitService } from '../unit/unit.service';
import { StackPipeWorkspaceService } from '../stack-pipe-workspace/stack-pipe.service';
import { UnitStackConfigurationWorkspaceService } from '../unit-stack-configuration-workspace/unit-stack-configuration.service';
import { MonitorFormulaWorkspaceService } from '../monitor-formula-workspace/monitor-formula.service';
import { MonitorSpanWorkspaceService } from '../monitor-span-workspace/monitor-span.service';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';

@Injectable()
export class ImportChecksService {
  constructor(
    private readonly componentService: ComponentWorkspaceService,
    private readonly qualificationService: MonitorQualificationWorkspaceService,
    private readonly monitorSystemService: MonitorSystemWorkspaceService,
    private readonly monitorLocationService: MonitorLocationWorkspaceService,
    private readonly unitService: UnitService,
    private readonly plantService: PlantService,
    private readonly unitStackService: UnitStackConfigurationWorkspaceService,
    private readonly formulaService: MonitorFormulaWorkspaceService,
    private readonly spanService: MonitorSpanWorkspaceService,
    private readonly stackPipeService: StackPipeWorkspaceService,
  ) {}

  private checkIfThrows(errorList: string[]) {
    if (errorList.length > 0) {
      throw new EaseyException(
        new Error(JSON.stringify(errorList)),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  public async runImportChecks(monPlan: UpdateMonitorPlanDTO) {
    let errorList = [];

    // Plant Check
    errorList.push(
      ...(await this.plantService.runPlantCheck(monPlan.orisCode)),
    );
    this.checkIfThrows(errorList);

    const facilityId = await this.plantService.getFacIdFromOris(
      monPlan.orisCode,
    );

    // Unit Stack Checks
    errorList.push(...this.unitStackService.runUnitStackChecks(monPlan));
    this.checkIfThrows(errorList);

    // Stack Pipe Checks
    errorList.push(
      ...(await this.stackPipeService.runStackPipeChecks(
        monPlan.monitoringLocationData.filter(location => location.stackPipeId),
        facilityId,
      )),
    );

    const databaseLocations = await this.monitorLocationService.getMonitorLocationsByFacilityAndOris(
      monPlan,
      facilityId,
      monPlan.orisCode,
    );

    let index = 0;
    for (const location of monPlan.monitoringLocationData) {
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
      if (location.componentData) {
        errorList.push(
          ...(await this.componentService.runComponentChecks(
            location.componentData,
            location,
            databaseLocations[index]?.id,
          )),
        );
      }

      // Qualification Checks
      if (location.monitoringQualificationData) {
        errorList.push(
          ...this.qualificationService.runQualificationImportCheck(
            location.monitoringQualificationData,
          ),
        );
      }

      // Monitor System Checks
      if (location.monitoringSystemData) {
        errorList.push(
          ...(await this.monitorSystemService.runMonitorSystemImportCheck(
            monPlan,
            location,
            location.monitoringSystemData,
            databaseLocations[index]?.id,
          )),
        );
      }

      // Formula Checks
      if (location.monitoringFormulaData) {
        errorList.push(
          ...(await this.formulaService.runFormulaChecks(
            location.monitoringFormulaData,
            databaseLocations[index]?.id,
          )),
        );
      }

      // Span Checks
      if (location.monitoringSpanData) {
        errorList.push(
          ...this.spanService.runSpanChecks(location.monitoringSpanData),
        );
      }

      index++;
    }
    this.checkIfThrows(errorList);
  }
}
