import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { MonitorLocationWorkspaceService } from '../monitor-location-workspace/monitor-location.service';
import { PlantService } from '../plant/plant.service';
import { ComponentWorkspaceService } from '../component-workspace/component.service';
import { UpdateMonitorPlanDTO } from '../dtos/monitor-plan-update.dto';
import { MonitorQualificationWorkspaceService } from '../monitor-qualification-workspace/monitor-qualification.service';
import { MonitorSystemWorkspaceService } from '../monitor-system-workspace/monitor-system.service';

@Injectable()
export class ImportChecksService {
  constructor(
    private readonly logger: Logger,
    private readonly componentService: ComponentWorkspaceService,

    private readonly qualificationService: MonitorQualificationWorkspaceService,

    @Inject(forwardRef(() => MonitorSystemWorkspaceService))
    private readonly monitorSystemService: MonitorSystemWorkspaceService,
    private readonly monitorLocationService: MonitorLocationWorkspaceService,
    private readonly plantService: PlantService,
  ) {}

  public async runImportChecks(monPlan: UpdateMonitorPlanDTO) {
    this.logger.info('Running import validation checks');
    let errorList = [];

    const facilityId = await this.plantService.getFacIdFromOris(
      monPlan.orisCode,
    );

    const databaseLocations = await this.monitorLocationService.getMonitorLocationsByFacilityAndOris(
      monPlan,
      facilityId,
      monPlan.orisCode,
    );

    let index = 0;
    for (const location of monPlan.locations) {
      // Component Checks
      errorList.push(
        ...(await this.componentService.runComponentChecks(
          location.components,
          location,
          databaseLocations[index].id,
        )),
      );

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

      index++;
    }

    if (errorList.length > 0) {
      this.logger.error(BadRequestException, errorList, true);
    }

    this.logger.info('Import validation checks ran successfully');
  }
}
