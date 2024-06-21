import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { currentDateTime } from '@us-epa-camd/easey-common/utilities/functions';
import { EntityManager } from 'typeorm';
import { v4 as uuid } from 'uuid';

import { AnalyzerRangeWorkspaceService } from '../analyzer-range-workspace/analyzer-range.service';
import { ComponentDTO, UpdateComponentBaseDTO } from '../dtos/component.dto';
import { UpdateMonitorLocationDTO } from '../dtos/monitor-location-update.dto';
import { Component } from '../entities/workspace/component.entity';
import { ComponentMap } from '../maps/component.map';
import { MonitorPlanWorkspaceService } from '../monitor-plan-workspace/monitor-plan.service';
import { UsedIdentifierRepository } from '../used-identifier/used-identifier.repository';
import { withTransaction } from '../utils';
import { ComponentWorkspaceRepository } from './component.repository';

@Injectable()
export class ComponentWorkspaceService {
  constructor(
    private readonly repository: ComponentWorkspaceRepository,
    private readonly usedIdRepo: UsedIdentifierRepository,

    private readonly map: ComponentMap,

    @Inject(forwardRef(() => AnalyzerRangeWorkspaceService))
    private readonly analyzerRangeDataService: AnalyzerRangeWorkspaceService,

    @Inject(forwardRef(() => MonitorPlanWorkspaceService))
    private readonly mpService: MonitorPlanWorkspaceService,
  ) {}

  async runComponentChecks(
    components: UpdateComponentBaseDTO[],
    monitorLocation: UpdateMonitorLocationDTO,
    monitorLocationId?: string,
  ): Promise<string[]> {
    const errorList: string[] = [];

    const validTypeCodes = ['SO2', 'NOX', 'CO2', 'O2', 'HG', 'HCL', 'HF'];

    const import32Error =
      '[IMPORT32-CRIT1-A] You have reported an AnalyzerRange record for a component with an inappropriate ComponentTypeCode.';

    for (const fileComponent of components) {
      const databaseComponent =
        monitorLocationId &&
        (await this.repository.findOneBy({
          locationId: monitorLocationId,
          componentId: fileComponent.componentId,
        }));

      if (
        databaseComponent &&
        databaseComponent.componentTypeCode !== fileComponent.componentTypeCode
      ) {
        errorList.push(
          `[IMPORT6-CRIT1-A] The component type ${fileComponent.componentTypeCode} for ComponentID ${fileComponent.componentId} in UnitStackPipeID ${monitorLocation.unitId}/${monitorLocation.stackPipeId} does not match the component type in the Workspace database.`,
        );
      }

      if (
        databaseComponent &&
        fileComponent.basisCode &&
        databaseComponent.basisCode !== fileComponent.basisCode
      ) {
        errorList.push(
          `[IMPORT6-CRIT1-B]The moisture basis ${fileComponent.basisCode} for ComponentID ${fileComponent.componentId} in UnitStackPipeID ${monitorLocation.unitId}/${monitorLocation.stackPipeId} does not match the moisture basis in the Workspace database.`,
        );
      }

      if (
        databaseComponent &&
        databaseComponent.analyzerRanges &&
        databaseComponent.analyzerRanges.length > 0 &&
        !validTypeCodes.includes(databaseComponent.componentTypeCode)
      ) {
        errorList.push(import32Error);
      } else if (
        fileComponent.analyzerRangeData &&
        fileComponent.analyzerRangeData.length > 0 &&
        !validTypeCodes.includes(fileComponent.componentTypeCode)
      ) {
        errorList.push(import32Error);
      }
    }

    return errorList;
  }

  async getComponents(locationId: string): Promise<ComponentDTO[]> {
    const results = await this.repository.find({
      where: {
        locationId,
      },
      order: {
        componentId: 'ASC',
      },
    });
    return this.map.many(results);
  }

  async getComponentByIdentifier(
    locationId: string,
    componentId: string,
    trx?: EntityManager,
  ): Promise<ComponentDTO> {
    const result = await withTransaction(
      this.repository,
      trx,
    ).getComponentByLocIdAndCompId(locationId, componentId);

    if (result) {
      return this.map.one(result);
    }

    return null;
  }

  async importComponent(
    location: UpdateMonitorLocationDTO,
    locationId: string,
    userId: string,
    trx?: EntityManager,
  ) {
    return new Promise(resolve => {
      (async () => {
        const repository = withTransaction(this.repository, trx);
        const innerPromises = [];
        for (const component of location.componentData) {
          innerPromises.push(
            new Promise(innerResolve => {
              (async () => {
                let compRecord = await repository.getComponentByLocIdAndCompId(
                  locationId,
                  component.componentId,
                );

                if (!compRecord) {
                  // Check used_identifier table to see if the componentId has already
                  // been used, and if so grab that component record for update
                  let usedIdentifier = await withTransaction(
                    this.usedIdRepo,
                    trx,
                  ).getBySpecs(locationId, component.componentId, 'C');

                  if (usedIdentifier)
                    compRecord = await repository.findOneBy({
                      id: usedIdentifier.id,
                    });
                }

                if (compRecord) {
                  await this.updateComponent({
                    locationId,
                    componentRecord: compRecord,
                    payload: component,
                    userId,
                    trx,
                  });
                } else {
                  await this.createComponent(
                    locationId,
                    component,
                    userId,
                    trx,
                  );
                  compRecord = await repository.getComponentByLocIdAndCompId(
                    locationId,
                    component.componentId,
                  );
                }

                await this.analyzerRangeDataService.importAnalyzerRange(
                  compRecord.componentId,
                  locationId,
                  component.analyzerRangeData,
                  userId,
                  trx,
                );

                innerResolve(true);
              })();
            }),
          );
        }
        await Promise.all(innerPromises);
        resolve(true);
      })();
    });
  }

  async updateComponent({
    locationId,
    componentRecord,
    payload,
    userId,
    trx,
  }: {
    locationId: string;
    componentRecord: Component;
    payload: UpdateComponentBaseDTO;
    userId: string;
    trx?: EntityManager;
  }): Promise<ComponentDTO> {
    componentRecord.modelVersion = payload.modelVersion;
    componentRecord.serialNumber = payload.serialNumber;
    componentRecord.hgConverterIndicator = payload.hgConverterIndicator;
    componentRecord.manufacturer = payload.manufacturer;
    componentRecord.componentTypeCode = payload.componentTypeCode;
    componentRecord.analyticalPrincipleCode = payload.analyticalPrincipleCode;
    componentRecord.sampleAcquisitionMethodCode =
      payload.sampleAcquisitionMethodCode;
    componentRecord.basisCode = payload.basisCode;
    componentRecord.userId = userId;
    componentRecord.updateDate = currentDateTime();

    const result = await withTransaction(this.repository, trx).save(
      componentRecord,
    );

    await this.mpService.resetToNeedsEvaluation(locationId, userId, trx);

    return this.map.one(result);
  }

  async createComponent(
    locationId: string,
    payload: UpdateComponentBaseDTO,
    userId: string,
    trx?: EntityManager,
  ): Promise<ComponentDTO> {
    const repository = withTransaction(this.repository, trx);
    const component = repository.create({
      id: uuid(),
      locationId,
      componentId: payload.componentId,
      modelVersion: payload.modelVersion,
      serialNumber: payload.serialNumber,
      manufacturer: payload.manufacturer,
      componentTypeCode: payload.componentTypeCode,
      analyticalPrincipleCode: payload.analyticalPrincipleCode,
      sampleAcquisitionMethodCode: payload.sampleAcquisitionMethodCode,
      basisCode: payload.basisCode,
      hgConverterIndicator: payload.hgConverterIndicator,
      userId: userId,
      addDate: currentDateTime(),
      updateDate: currentDateTime(),
    });

    const result = await repository.save(component);

    await this.mpService.resetToNeedsEvaluation(locationId, userId, trx);

    return this.map.one(result);
  }
}
