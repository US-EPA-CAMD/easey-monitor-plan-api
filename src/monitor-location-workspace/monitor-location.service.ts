import {
  BadRequestException,
  forwardRef,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';

import { ComponentWorkspaceService } from '../component-workspace/component.service';
import { UpdateMonitorLocationDTO } from '../dtos/monitor-location-update.dto';
import { MonitorLocationDTO } from '../dtos/monitor-location.dto';
import { UpdateMonitorPlanDTO } from '../dtos/monitor-plan-update.dto';
import { DuctWafWorkspaceService } from '../duct-waf-workspace/duct-waf.service';
import { MonitorLocation } from '../entities/workspace/monitor-location.entity';
import { MonitorLocationMap } from '../maps/monitor-location.map';
import { MatsMethodWorkspaceService } from '../mats-method-workspace/mats-method.service';
import { MonitorAttributeWorkspaceService } from '../monitor-attribute-workspace/monitor-attribute.service';
import { MonitorDefaultWorkspaceService } from '../monitor-default-workspace/monitor-default.service';
import { MonitorFormulaWorkspaceService } from '../monitor-formula-workspace/monitor-formula.service';
import { MonitorLoadWorkspaceService } from '../monitor-load-workspace/monitor-load.service';
import { MonitorMethodWorkspaceService } from '../monitor-method-workspace/monitor-method.service';
import { MonitorQualificationWorkspaceService } from '../monitor-qualification-workspace/monitor-qualification.service';
import { MonitorSpanWorkspaceService } from '../monitor-span-workspace/monitor-span.service';
import { MonitorSystemWorkspaceService } from '../monitor-system-workspace/monitor-system.service';
import { StackPipeService } from '../stack-pipe/stack-pipe.service';
import { UnitCapacityWorkspaceService } from '../unit-capacity-workspace/unit-capacity.service';
import { UnitControlWorkspaceService } from '../unit-control-workspace/unit-control.service';
import { UnitFuelWorkspaceService } from '../unit-fuel-workspace/unit-fuel.service';
import { UnitStackConfigurationWorkspaceService } from '../unit-stack-configuration-workspace/unit-stack-configuration.service';
import { UnitService } from '../unit/unit.service';
import { MonitorLocationWorkspaceRepository } from './monitor-location.repository';

@Injectable()
export class MonitorLocationWorkspaceService {
  readonly errorMsg: 'Monitor Location Not Found';
  constructor(
    private readonly repository: MonitorLocationWorkspaceRepository,
    private readonly map: MonitorLocationMap,
    private readonly uscServcie: UnitStackConfigurationWorkspaceService,
    private readonly unitService: UnitService,
    private readonly stackPipeService: StackPipeService,
    @Inject(forwardRef(() => ComponentWorkspaceService))
    private readonly componentService: ComponentWorkspaceService,
    private readonly unitCapacityService: UnitCapacityWorkspaceService,
    private readonly unitControlService: UnitControlWorkspaceService,
    private readonly unitFuelService: UnitFuelWorkspaceService,
    private readonly qualificationService: MonitorQualificationWorkspaceService,
    private readonly systemService: MonitorSystemWorkspaceService,
    private readonly loadService: MonitorLoadWorkspaceService,
    private readonly formulaService: MonitorFormulaWorkspaceService,
    private readonly matsMethodService: MatsMethodWorkspaceService,
    private readonly methodService: MonitorMethodWorkspaceService,
    private readonly ductWafService: DuctWafWorkspaceService,
    private readonly spanService: MonitorSpanWorkspaceService,
    private readonly defaultService: MonitorDefaultWorkspaceService,

    @Inject(forwardRef(() => MonitorAttributeWorkspaceService))
    private readonly monitorAttributeService: MonitorAttributeWorkspaceService,
  ) {}

  async getMonitorLocationsByFacilityAndOris(
    plan: UpdateMonitorPlanDTO,
    facilitId: number,
    orisCode: number,
  ): Promise<MonitorLocation[]> {
    const locations = [];

    for (const loc of plan.monitoringLocationData) {
      locations.push(await this.getLocationRecord(loc, facilitId, orisCode));
    }

    return locations;
  }

  async getMonitorLocationsByFacilityId(
    facilityId: number,
  ): Promise<MonitorLocationDTO[]> {
    const results = await this.repository.getMonitorLocationsByFacId(
      facilityId,
    );

    return this.map.many(results);
  }

  async getLocation(locationId: string): Promise<MonitorLocationDTO> {
    const result = await this.repository.findOneBy({ id: locationId });

    if (!result) {
      throw new EaseyException(new Error(this.errorMsg), HttpStatus.NOT_FOUND, {
        locationId: locationId,
      });
    }

    return this.map.one(result);
  }

  async getLocationRecord(
    loc: UpdateMonitorLocationDTO,
    facilityId: number,
    orisCode: number,
  ): Promise<MonitorLocation> {
    let location: MonitorLocation;

    if (loc.unitId) {
      const unit = await this.unitService.getUnitByNameAndFacId(
        loc.unitId,
        facilityId,
      );

      if (!unit) {
        throw new BadRequestException(
          CheckCatalogService.formatMessage(
            'The database does not contain a record for Unit [unit] and Facility: [orisCode]',
            { unit: loc.unitId, orisCode: orisCode },
          ),
        );
      }

      location = await this.repository.findOne({
        where: {
          unitId: unit.id,
        },
      });
    }

    if (loc.stackPipeId) {
      const stackPipe = await this.stackPipeService.getStackByNameAndFacId(
        loc.stackPipeId,
        facilityId,
      );

      if (!stackPipe) {
        throw new BadRequestException(
          CheckCatalogService.formatMessage(
            'The database does not contain a record for Stack Pipe [stackPipe] and Facility: [orisCode]',
            { stackPipe: loc.stackPipeId, orisCode: orisCode },
          ),
        );
      }

      location = await this.repository.findOne({
        where: {
          stackPipeId: stackPipe.id,
        },
      });
    }

    return location;
  }

  async getLocationEntity(locationId: string): Promise<MonitorLocation> {
    const result = await this.repository.findOneBy({ id: locationId });
    if (!result) {
      throw new EaseyException(new Error(this.errorMsg), HttpStatus.NOT_FOUND, {
        locationId: locationId,
      });
    }
    return result;
  }

  async getLocationRelationships(locId: string) {
    const location = await this.getLocationEntity(locId);
    const isUnit = location.unit !== null;
    const id = location.unit ? location.unit.id : location.stackPipe.id;
    return this.uscServcie.getUnitStackRelationships(id, isUnit);
  }

  async importMonitorLocation(
    plan: UpdateMonitorPlanDTO,
    facilityId: number,
    userId: string,
  ) {
    return new Promise(resolve => {
      (async () => {
        const promises = [];

        for (const location of plan.monitoringLocationData) {
          promises.push(
            new Promise(innerResolve => {
              (async () => {
                const innerPromises = [];

                // Get LocIds by unitId (unitName) or stackPipeId(stackPipeName)
                const monitorLocationRecord = await this.getLocationRecord(
                  location,
                  facilityId,
                  plan.orisCode,
                );

                if (location.unitId) {
                  const unitRecord = await this.unitService.getUnitByNameAndFacId(
                    location.unitId,
                    facilityId,
                  );

                  innerPromises.push(
                    this.unitService.importUnit(
                      unitRecord,
                      location.nonLoadBasedIndicator,
                    ),
                  );

                  if (
                    location.unitCapacityData &&
                    location.unitCapacityData.length > 0
                  ) {
                    innerPromises.push(
                      this.unitCapacityService.importUnitCapacity(
                        location.unitCapacityData,
                        unitRecord.id,
                        monitorLocationRecord.id,
                        userId,
                      ),
                    );
                  }

                  if (
                    location.unitControlData &&
                    location.unitControlData.length > 0
                  ) {
                    innerPromises.push(
                      this.unitControlService.importUnitControl(
                        location.unitControlData,
                        unitRecord.id,
                        monitorLocationRecord.id,
                        userId,
                      ),
                    );
                  }

                  if (
                    location.unitFuelData &&
                    location.unitFuelData.length > 0
                  ) {
                    innerPromises.push(
                      this.unitFuelService.importUnitFuel(
                        location.unitFuelData,
                        unitRecord.id,
                        monitorLocationRecord.id,
                        userId,
                      ),
                    );
                  }
                }

                if (location.stackPipeId) {
                  const stackPipeRecord = await this.stackPipeService.getStackByNameAndFacId(
                    location.stackPipeId,
                    facilityId,
                  );

                  innerPromises.push(
                    this.stackPipeService.importStackPipe(
                      stackPipeRecord,
                      location.retireDate,
                    ),
                  );
                }

                if (
                  location.componentData &&
                  location.componentData.length > 0
                ) {
                  innerPromises.push(
                    this.componentService.importComponent(
                      location,
                      monitorLocationRecord.id,
                      userId,
                    ),
                  );
                }

                if (
                  location.monitoringSystemData &&
                  location.monitoringSystemData.length > 0
                ) {
                  innerPromises.push(
                    this.systemService.importSystem(
                      location.monitoringSystemData,
                      monitorLocationRecord.id,
                      userId,
                    ),
                  );
                }

                if (
                  location.monitoringQualificationData &&
                  location.monitoringQualificationData.length > 0
                ) {
                  innerPromises.push(
                    this.qualificationService.importQualification(
                      location.monitoringQualificationData,
                      monitorLocationRecord.id,
                      userId,
                    ),
                  );
                }

                if (
                  location.supplementalMATSMonitoringMethodData &&
                  location.supplementalMATSMonitoringMethodData.length > 0
                ) {
                  innerPromises.push(
                    this.matsMethodService.importMatsMethod(
                      monitorLocationRecord.id,
                      location.supplementalMATSMonitoringMethodData,
                      userId,
                    ),
                  );
                }

                if (
                  location.monitoringLoadData &&
                  location.monitoringLoadData.length > 0
                ) {
                  innerPromises.push(
                    this.loadService.importLoad(
                      monitorLocationRecord.id,
                      location.monitoringLoadData,
                      userId,
                    ),
                  );
                }

                if (
                  location.monitoringLocationAttribData &&
                  location.monitoringLocationAttribData.length > 0
                ) {
                  innerPromises.push(
                    this.monitorAttributeService.importAttributes(
                      monitorLocationRecord.id,
                      location.monitoringLocationAttribData,
                      userId,
                    ),
                  );
                }

                if (
                  location.monitoringFormulaData &&
                  location.monitoringFormulaData.length > 0
                ) {
                  innerPromises.push(
                    this.formulaService.importFormula(
                      location.monitoringFormulaData,
                      monitorLocationRecord.id,
                      userId,
                    ),
                  );
                }

                if (
                  location.monitoringMethodData &&
                  location.monitoringMethodData.length > 0
                ) {
                  innerPromises.push(
                    this.methodService.importMethod(
                      monitorLocationRecord.id,
                      location.monitoringMethodData,
                      userId,
                    ),
                  );
                }

                if (
                  location.rectangularDuctWAFData &&
                  location.rectangularDuctWAFData.length > 0
                ) {
                  innerPromises.push(
                    this.ductWafService.importDuctWaf(
                      monitorLocationRecord.id,
                      location.rectangularDuctWAFData,
                      userId,
                    ),
                  );
                }

                if (
                  location.monitoringSpanData &&
                  location.monitoringSpanData.length > 0
                ) {
                  innerPromises.push(
                    this.spanService.importSpan(
                      monitorLocationRecord.id,
                      location.monitoringSpanData,
                      userId,
                    ),
                  );
                }

                if (
                  location.monitoringDefaultData &&
                  location.monitoringDefaultData.length > 0
                ) {
                  innerPromises.push(
                    this.defaultService.importDefault(
                      monitorLocationRecord.id,
                      location.monitoringDefaultData,
                      userId,
                    ),
                  );
                }

                await Promise.all(innerPromises);
                innerResolve(true);
              })();
            }),
          );
        }

        await Promise.all(promises);

        resolve(true);
      })();
    });
  }
}
