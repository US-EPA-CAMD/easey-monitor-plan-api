import {
  BadRequestException,
  forwardRef,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { currentDateTime } from '@us-epa-camd/easey-common/utilities/functions';
import { EntityManager } from 'typeorm';
import { v4 as uuid } from 'uuid';

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
import { withTransaction } from '../utils';
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

  async createMonitorLocationRecord({
    unitId,
    stackPipeId,
    trx,
    userId,
  }: {
    unitId?: number;
    stackPipeId?: string;
    trx?: EntityManager;
    userId?: string;
  }) {
    if (!unitId && !stackPipeId) {
      throw new EaseyException(
        new Error('One of Unit ID or Stack Pipe ID is required'),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const repository = withTransaction(this.repository, trx);

    const monitorLocation = repository.create({
      id: uuid(),
      addDate: currentDateTime(),
      stackPipeId,
      unitId,
      updateDate: currentDateTime(),
      userId,
    });

    return await repository.save(monitorLocation);
  }

  async getMonitorLocationsByFacilityAndOris(
    plan: UpdateMonitorPlanDTO,
    facilityId: number,
    orisCode: number,
  ): Promise<MonitorLocation[]> {
    const locations = [];

    for (const loc of plan.monitoringLocationData) {
      locations.push(await this.getLocationRecord(loc, facilityId, orisCode));
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
  ) {
    return await this.getOrCreateLocationRecord({
      loc,
      facilityId,
      orisCode,
      create: false,
    });
  }

  async getOrCreateLocationRecord({
    create,
    facilityId,
    loc,
    orisCode,
    trx,
    userId,
  }: {
    create: boolean;
    facilityId: number;
    loc: UpdateMonitorLocationDTO;
    orisCode: number;
    trx?: EntityManager;
    userId?: string;
  }): Promise<MonitorLocation> {
    let location: MonitorLocation;

    const repository = withTransaction(this.repository, trx);

    if (loc.unitId) {
      const unit = await this.unitService.getUnitByNameAndFacId(
        loc.unitId,
        facilityId,
        trx,
      );

      if (!unit) {
        // All units should already exist in the database.
        throw new BadRequestException(
          CheckCatalogService.formatMessage(
            'The database does not contain a record for Unit [unit] and Facility: [orisCode]',
            { unit: loc.unitId, orisCode: orisCode },
          ),
        );
      }

      location = await repository.findOne({
        where: {
          unitId: unit.id,
        },
      });
    }

    if (loc.stackPipeId) {
      let stackPipe = await this.stackPipeService.getStackByNameAndFacId(
        loc.stackPipeId,
        facilityId,
        trx,
      );

      if (!stackPipe && create) {
        // A stack/pipe may not exist in the database.
        stackPipe = await this.stackPipeService.createStackPipeRecord(
          loc,
          facilityId,
          userId,
          trx,
        );
      }

      location =
        stackPipe &&
        (await repository.findOne({
          where: {
            stackPipeId: stackPipe.id,
          },
        }));

      if (!location && create) {
        location = await this.createMonitorLocationRecord({
          stackPipeId: stackPipe.id,
          trx,
          userId,
        });
      }
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

  async importMonitorLocations(
    plan: UpdateMonitorPlanDTO,
    facilityId: number,
    userId: string,
    trx?: EntityManager, // Use if running inside a transaction
  ) {
    const locations: MonitorLocationDTO[] = [];

    await new Promise(resolve => {
      (async () => {
        const promises = [];

        for (const location of plan.monitoringLocationData) {
          promises.push(
            new Promise(innerResolve => {
              (async () => {
                const innerPromises = [];

                // Get LocIds by unitId (unitName) or stackPipeId(stackPipeName)
                const monitorLocationRecord = await this.getOrCreateLocationRecord(
                  {
                    loc: location,
                    facilityId,
                    orisCode: plan.orisCode,
                    create: true,
                    trx,
                    userId,
                  },
                );

                if (location.unitId) {
                  const unitRecord = await this.unitService.getUnitByNameAndFacId(
                    location.unitId,
                    facilityId,
                    trx,
                  );

                  innerPromises.push(
                    this.unitService.importUnit(
                      unitRecord,
                      location.nonLoadBasedIndicator,
                      trx,
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
                        trx,
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
                        trx,
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
                        trx,
                      ),
                    );
                  }
                }

                if (location.stackPipeId) {
                  const stackPipeRecord = await this.stackPipeService.getStackByNameAndFacId(
                    location.stackPipeId,
                    facilityId,
                    trx,
                  );

                  innerPromises.push(
                    this.stackPipeService.importStackPipe(
                      stackPipeRecord,
                      location.retireDate,
                      trx,
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
                      trx,
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
                      trx,
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
                      trx,
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
                      trx,
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
                      trx,
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
                      trx,
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
                      trx,
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
                      trx,
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
                      trx,
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
                      trx,
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
                      trx,
                    ),
                  );
                }

                await Promise.all(innerPromises);
                locations.push(await this.map.one(monitorLocationRecord));
                innerResolve(true);
              })();
            }),
          );
        }

        await Promise.all(promises);

        resolve(true);
      })();
    });

    return locations;
  }
}
