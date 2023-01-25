import {
  BadRequestException,
  forwardRef,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { MonitorLocation } from '../entities/monitor-location.entity';
import { MonitorLocationMap } from '../maps/monitor-location.map';
import { MonitorLocationWorkspaceRepository } from './monitor-location.repository';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';

import { UpdateMonitorPlanDTO } from '../dtos/monitor-plan-update.dto';
import { MonitorLocationDTO } from '../dtos/monitor-location.dto';
import { UpdateMonitorLocationDTO } from '../dtos/monitor-location-update.dto';

import { UnitService } from '../unit/unit.service';
import { StackPipeService } from '../stack-pipe/stack-pipe.service';
import { UnitStackConfigurationWorkspaceService } from '../unit-stack-configuration-workspace/unit-stack-configuration.service';
import { UnitCapacityWorkspaceService } from '../unit-capacity-workspace/unit-capacity.service';
import { UnitControlWorkspaceService } from '../unit-control-workspace/unit-control.service';
import { UnitFuelWorkspaceService } from '../unit-fuel-workspace/unit-fuel.service';
import { ComponentWorkspaceService } from '../component-workspace/component.service';
import { MonitorSystemWorkspaceService } from '../monitor-system-workspace/monitor-system.service';
import { MonitorQualificationWorkspaceService } from '../monitor-qualification-workspace/monitor-qualification.service';
import { MatsMethodWorkspaceService } from '../mats-method-workspace/mats-method.service';
import { MonitorLoadWorkspaceService } from '../monitor-load-workspace/monitor-load.service';
import { MonitorFormulaWorkspaceService } from '../monitor-formula-workspace/monitor-formula.service';
import { MonitorAttributeWorkspaceService } from '../monitor-attribute-workspace/monitor-attribute.service';
import { MonitorMethodWorkspaceService } from '../monitor-method-workspace/monitor-method.service';
import { DuctWafWorkspaceService } from '../duct-waf-workspace/duct-waf.service';
import { MonitorSpanWorkspaceService } from '../monitor-span-workspace/monitor-span.service';
import { MonitorDefaultWorkspaceService } from '../monitor-default-workspace/monitor-default.service';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';

@Injectable()
export class MonitorLocationWorkspaceService {
  readonly errorMsg: 'Monitor Location Not Found';
  constructor(
    @InjectRepository(MonitorLocationWorkspaceRepository)
    private readonly repository: MonitorLocationWorkspaceRepository,
    private readonly map: MonitorLocationMap,
    private readonly uscServcie: UnitStackConfigurationWorkspaceService,
    private readonly unitService: UnitService,
    private readonly stackPipeService: StackPipeService,
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
    private readonly logger: Logger,

    @Inject(forwardRef(() => MonitorAttributeWorkspaceService))
    private readonly monitorAttributeService: MonitorAttributeWorkspaceService,
  ) {}

  async getMonitorLocationsByFacilityAndOris(
    plan: UpdateMonitorPlanDTO,
    facilitId: number,
    orisCode: number,
  ): Promise<MonitorLocation[]> {
    const locations = [];

    for (const loc of plan.locations) {
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
    const result = await this.repository.findOne(locationId);

    if (!result) {
      throw new LoggingException(this.errorMsg, HttpStatus.NOT_FOUND, {
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

      if (unit === undefined) {
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

      if (stackPipe === undefined) {
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

  // async getLocationRelationships(locationId: string) {
  //   return this.uscServcie.getUnitStackConfigsByLocationIds([locationId]);
  // }

  async getLocationEntity(locationId: string): Promise<MonitorLocation> {
    const result = await this.repository.findOne(locationId);
    if (!result) {
      throw new LoggingException(this.errorMsg, HttpStatus.NOT_FOUND, {
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
    return new Promise(async resolve => {
      const promises = [];

      for (const location of plan.locations) {
        promises.push(
          new Promise(async innerResolve => {
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
                location.unitCapacities &&
                location.unitCapacities.length > 0
              ) {
                innerPromises.push(
                  this.unitCapacityService.importUnitCapacity(
                    location.unitCapacities,
                    unitRecord.id,
                    monitorLocationRecord.id,
                    userId,
                  ),
                );
              }

              if (location.unitControls && location.unitControls.length > 0) {
                innerPromises.push(
                  this.unitControlService.importUnitControl(
                    location.unitControls,
                    unitRecord.id,
                    monitorLocationRecord.id,
                    userId,
                  ),
                );
              }

              if (location.unitFuels && location.unitFuels.length > 0) {
                innerPromises.push(
                  this.unitFuelService.importUnitFuel(
                    location.unitFuels,
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

            if (location.components && location.components.length > 0) {
              innerPromises.push(
                this.componentService.importComponent(
                  location,
                  monitorLocationRecord.id,
                  userId,
                ),
              );
            }

            if (location.systems && location.systems.length > 0) {
              innerPromises.push(
                this.systemService.importSystem(
                  location.systems,
                  monitorLocationRecord.id,
                  userId,
                ),
              );
            }

            if (location.qualifications && location.qualifications.length > 0) {
              innerPromises.push(
                this.qualificationService.importQualification(
                  location.qualifications,
                  monitorLocationRecord.id,
                  userId,
                ),
              );
            }

            if (location.matsMethods && location.matsMethods.length > 0) {
              innerPromises.push(
                this.matsMethodService.importMatsMethod(
                  monitorLocationRecord.id,
                  location.matsMethods,
                  userId,
                ),
              );
            }

            if (location.loads && location.loads.length > 0) {
              innerPromises.push(
                this.loadService.importLoad(
                  monitorLocationRecord.id,
                  location.loads,
                  userId,
                ),
              );
            }

            if (location.attributes && location.attributes.length > 0) {
              innerPromises.push(
                this.monitorAttributeService.importAttributes(
                  monitorLocationRecord.id,
                  location.attributes,
                  userId,
                ),
              );
            }

            if (location.formulas && location.formulas.length > 0) {
              innerPromises.push(
                this.formulaService.importFormula(
                  location.formulas,
                  monitorLocationRecord.id,
                  userId,
                ),
              );
            }

            if (location.methods && location.methods.length > 0) {
              innerPromises.push(
                this.methodService.importMethod(
                  monitorLocationRecord.id,
                  location.methods,
                  userId,
                ),
              );
            }

            if (location.ductWafs && location.ductWafs.length > 0) {
              innerPromises.push(
                this.ductWafService.importDuctWaf(
                  monitorLocationRecord.id,
                  location.ductWafs,
                  userId,
                ),
              );
            }

            if (location.spans && location.spans.length > 0) {
              innerPromises.push(
                this.spanService.importSpan(
                  monitorLocationRecord.id,
                  location.spans,
                  userId,
                ),
              );
            }

            if (location.defaults && location.defaults.length > 0) {
              innerPromises.push(
                this.defaultService.importDefault(
                  monitorLocationRecord.id,
                  location.defaults,
                  userId,
                ),
              );
            }

            await Promise.all(innerPromises);
            innerResolve(true);
          }),
        );
      }

      await Promise.all(promises);

      resolve(true);
    });
  }
}
