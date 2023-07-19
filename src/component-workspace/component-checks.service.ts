import { HttpStatus, Injectable } from '@nestjs/common';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
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
      throw new EaseyException(
        new Error(JSON.stringify(errorList)),
        HttpStatus.BAD_REQUEST,
      );
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
    const errorList: string[] = [];
    let error: string = null;

    error = await this.component13Check(component, errorLocation);
    if (error) {
      errorList.push(error);
    }

    error = await this.component14Check(locationId, component, errorLocation);
    if (error) {
      errorList.push(error);
    }

    error = await this.component81Check(component, errorLocation);
    if (error) {
      errorList.push(error);
    }

    if (!isImport && !isUpdate) {
      error = await this.component53Check(locationId, component, errorLocation);
      if (error) {
        errorList.push(error);
      }
    }

    this.throwIfErrors(errorList);
    return errorList;
  }

  private async component13Check(
    component: UpdateComponentBaseDTO | SystemComponentBaseDTO,
    errorLocation: string = '',
  ): Promise<string> {
    let error = null;

    if (!component.sampleAcquisitionMethodCode) {
      const result = await this.sysCompMDRelRepository.findOne({
        sampleAcquisitionMethodCode: component.sampleAcquisitionMethodCode,
        componentTypeCode: component.componentTypeCode,
        basisCode: component.basisCode,
      });

      if (!result) {
        error =
          errorLocation +
          this.getMessage('COMPON-13-A', {
            fieldname: 'sampleAcquisitionMethodCode',
            key: KEY,
          });
      }
    }

    return error;
  }

  private async component14Check(
    locationId: string,
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
      if (!component.basisCode) {
        errorCode = 'COMPON-14-A';
      } else {
        if (
          !['W', 'D', 'B'].includes(component.basisCode) ||
          (component.componentTypeCode === 'FLOW' &&
            component.basisCode !== 'W') ||
          (component.componentTypeCode === 'STRAIN' &&
            component.basisCode !== 'D') ||
          (component.componentTypeCode !== 'O2' && component.basisCode === 'B')
        ) {
          errorCode = 'COMPON-14-B';
        }

        if (component.basisCode !== 'B') {
          const usedIdRecord = await this.usedIdRepository.findOne({
            tableCode: 'C',
            identifier: component.componentId,
            locationId,
          });

          if (
            usedIdRecord?.formulaOrBasisCode &&
            component.basisCode !== usedIdRecord.formulaOrBasisCode
          ) {
            errorCode = 'COMPON-14-C';
          }
        }
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

  private component81Check(
    component: UpdateComponentBaseDTO | SystemComponentBaseDTO,
    errorLocation: string = '',
  ) {
    let error = null;
    let errorCode = null;
    if (component.componentTypeCode === 'HG') {
      if (
        component.hgConverterIndicator === null ||
        component.hgConverterIndicator === undefined
      ) {
        errorCode = 'COMPON-81-A';
      } else if (![1, 0].includes(component.hgConverterIndicator)) {
        errorCode = 'COMPON-81-B';
      }
    } else {
      if (component.hgConverterIndicator) {
        errorCode = 'COMPON-81-C';
      }
    }

    if (errorCode) {
      error =
        errorLocation +
        this.getMessage(errorCode, {
          value: component.hgConverterIndicator,
          fieldname: 'hgConverterIndicator',
          key: KEY,
          componentType: component.componentTypeCode,
          condition: component.componentTypeCode,
        });
    }

    return error;
  }
}
