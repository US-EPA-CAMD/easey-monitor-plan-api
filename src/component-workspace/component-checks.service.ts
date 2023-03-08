import { HttpStatus, Injectable } from '@nestjs/common';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { SystemComponentMasterDataRelationshipRepository } from '../system-component-master-data-relationship/system-component-master-data-relationship.repository';
import { UpdateComponentBaseDTO } from '../dtos/component.dto';
import { UsedIdentifierRepository } from '../used-identifier/used-identifier.repository';
import { SystemComponentBaseDTO } from '../dtos/system-component.dto';
import { ComponentWorkspaceRepository } from './component.repository';

const KEY = 'Component';

@Injectable()
export class ComponentCheckService {
  constructor(
    private readonly logger: Logger,
    private readonly sysCompMDRelRepository: SystemComponentMasterDataRelationshipRepository,
    private readonly usedIdRepository: UsedIdentifierRepository,
    private readonly componentRepository: ComponentWorkspaceRepository,
  ) {}

  private throwIfErrors(errorList: string[]) {
    if (errorList.length > 0) {
      throw new LoggingException(errorList, HttpStatus.BAD_REQUEST);
    }
  }

  getMessage(messageKey: string, messageArgs?: object): string {
    return CheckCatalogService.formatResultMessage(messageKey, messageArgs);
  }

  async runChecks(
    locationId: string,
    component: UpdateComponentBaseDTO | SystemComponentBaseDTO,
    isImport: boolean = false,
    isUpdate: boolean = false,
    errorLocation: string = '',
  ) {
    this.logger.info('Running Component Checks');

    const errorList: string[] = [];
    let error: string = null;

    error = this.component13Check(component, errorLocation);
    if (error) {
      errorList.push(error);
    }

    error = await this.component14Check(component, errorLocation);
    if (error) {
      errorList.push(error);
    }

    if (!isUpdate || !isImport) {
      error = await this.component53Check(locationId, component, errorLocation);
      if (error) {
        errorList.push(error);
      }
    }

    this.throwIfErrors(errorList);
    this.logger.info('Completed Component Checks');
    return errorList;
  }

  private component13Check(
    component: UpdateComponentBaseDTO | SystemComponentBaseDTO,
    errorLocation: string = '',
  ): string {
    let error = null;

    if (!component.sampleAcquisitionMethodCode) {
      const result = this.sysCompMDRelRepository.findOne({
        sampleAcquisitionMethodCode: component.sampleAcquisitionMethodCode,
        componentTypeCode: component.componentTypeCode,
        basisCode: component.basisCode,
      });

      if (!result) {
        error = errorLocation + this.getMessage('COMPON-13-A');
      }
    }

    return error;
  }

  private async component14Check(
    component: UpdateComponentBaseDTO | SystemComponentBaseDTO,
    errorLocation: string = '',
  ): Promise<string> {
    let error = null;
    let errorCode = null;

    if (
      ['NOX', 'SO2', 'CO2', 'O2', 'FLOW', 'HG', 'HCL', 'HF', 'STRAIN'].includes(
        component.componentTypeCode,
      )
    ) {
      switch (true) {
        case !component.basisCode:
          errorCode = 'COMPON-14-A';
          break;
        case !['W', 'D', 'B'].includes(component.basisCode):
          errorCode = 'COMPON-14-B';
          break;
        case component.componentTypeCode === 'FLOW' &&
          component.basisCode !== 'W':
          errorCode = 'COMPON-14-B';
          break;
        case component.componentTypeCode === 'STRAIN' &&
          component.basisCode !== 'D':
          errorCode = 'COMPON-14-B';
          break;
        case component.componentTypeCode !== 'O2' &&
          component.basisCode === 'B':
          errorCode = 'COMPON-14-B';
          break;
        case component.basisCode !== 'B':
          const usedIdRecord = await this.usedIdRepository.findOne({
            tableCode: 'C',
            identifier: component.componentId,
          });

          if (
            usedIdRecord?.formulaOrBasisCode &&
            component.basisCode !== usedIdRecord.formulaOrBasisCode
          ) {
            errorCode = 'COMPON-14-C';
          }
          break;
      }
    } else {
      if (component.basisCode) {
        errorCode = 'COMPON-14-D';
      }
    }

    if (errorCode) {
      error =
        errorLocation +
        this.getMessage(errorCode, {
          value: component.basisCode,
          fieldname: 'basisCode',
          key: KEY,
          componentType: component.componentTypeCode,
        });
    }

    return error;
  }

  private async component53Check(
    locationId: string,
    component: UpdateComponentBaseDTO | SystemComponentBaseDTO,
    errorLocation: string = '',
  ): Promise<string> {
    let error = null;

    let compRecord = await this.componentRepository.getComponentByLocIdAndCompId(
      locationId,
      component.componentId,
    );

    if (compRecord) {
      error =
        errorLocation +
        this.getMessage('COMPON-53-A', {
          recordtype: 'Component',
          fieldnames: 'locationId, componentId',
        });
    }

    return error;
  }
}
