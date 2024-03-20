import { ApiProperty } from '@nestjs/swagger';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';
import { FindOneOptions } from 'typeorm';

import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateIf,
  ValidationArguments,
} from 'class-validator';
import { ComponentBaseDTO } from './component.dto';
import { IsInRange } from '@us-epa-camd/easey-common/pipes/is-in-range.pipe';
import {IsIsoFormat, IsValidDate, MatchesRegEx, IsValidCode} from '@us-epa-camd/easey-common/pipes';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';
import { IsInDateRange } from '../import-checks/pipes/is-in-date-range.pipe';
import {
  DATE_FORMAT,
  MAXIMUM_FUTURE_DATE,
  MAX_HOUR,
  MINIMUM_DATE,
  MIN_HOUR,
} from '../utilities/constants';
import { BeginEndDatesConsistent } from '../utils';
import { SystemComponentMasterDataRelationships } from '../entities/system-component-master-data-relationship.entity';
import { AnalyticalPrincipalCode } from '../entities/analytical-principal-code.entity';
import { BasisCode } from '../entities/basis-code.entity';

const KEY = 'System Component';

export class SystemComponentBaseDTO {
  @ApiProperty({
    description: propertyMetadata.systemComponentDTOComponentId.description,
    example: propertyMetadata.systemComponentDTOComponentId.example,
    name: propertyMetadata.systemComponentDTOComponentId.fieldLabels.value,
  })
  @IsString()
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('COMPON-8-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @MatchesRegEx('^[A-Z0-9]{1,3}$', {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('COMPON-8-B', {
        iD: args.value,
      });
    },
  })
  componentId: string;

  @ApiProperty({
    description: propertyMetadata.systemComponentDTOComponentTypeCode.description,
    example: propertyMetadata.systemComponentDTOComponentTypeCode.example,
    name: propertyMetadata.systemComponentDTOComponentTypeCode.fieldLabels.value,
  })
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('COMPON-12-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @IsValidCode(SystemComponentMasterDataRelationships, {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('COMPON-12-B', {
        value: args.value,
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @IsString()
  componentTypeCode: string;

  @ApiProperty({
    description:
      propertyMetadata.componentDTOAnalyticalPrincipleCode.description,
    example: propertyMetadata.componentDTOAnalyticalPrincipleCode.example,
    name:
      propertyMetadata.componentDTOAnalyticalPrincipleCode.fieldLabels.value,
  })
  @IsValidCode(AnalyticalPrincipalCode, {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatMessage(
        'You reported the value [value], which is not in the list of valid values, in the field Critical Error Level [fieldname] for [key].',
        {
          value: args.value,
          fieldname: args.property,
          key: KEY,
        },
      );
    },
  })
  @IsString()
  @IsOptional()
  analyticalPrincipleCode: string;

  @ApiProperty({
    description:
      propertyMetadata.systemComponentDTOSampleAcquisitionMethodCode.description,
    example: propertyMetadata.systemComponentDTOSampleAcquisitionMethodCode.example,
    name:
      propertyMetadata.systemComponentDTOSampleAcquisitionMethodCode.fieldLabels
        .value,
  })
  @IsValidCode(
    SystemComponentMasterDataRelationships,
    {
      message: (args: ValidationArguments) => {
        return CheckCatalogService.formatResultMessage('COMPON-13-B', {
          value: args.value,
          fieldname: args.property,
          key: KEY,
        });
      },
    },
    (
      args: ValidationArguments,
    ): FindOneOptions<SystemComponentMasterDataRelationships> => {
      return { where: { sampleAcquisitionMethodCode: args.value } };
    },
  )
  @IsString()
  @IsOptional()
  sampleAcquisitionMethodCode: string;

  @ApiProperty({
    description: propertyMetadata.systemComponentDTOBasisCode.description,
    example: propertyMetadata.systemComponentDTOBasisCode.example,
    name: propertyMetadata.systemComponentDTOBasisCode.fieldLabels.value,
  })
  @IsValidCode(BasisCode, {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('COMPON-14-B', {
        value: args.value,
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @IsString()
  @IsOptional()
  basisCode: string;

  @ApiProperty({
    description: propertyMetadata.systemComponentDTOManufacturer.description,
    example: propertyMetadata.systemComponentDTOManufacturer.example,
    name: propertyMetadata.systemComponentDTOManufacturer.fieldLabels.value,
  })
  @IsOptional()
  @MaxLength(25, {
    message: (args: ValidationArguments) => {
      return `The value for [${args.value}] in the Component record [${args.property}] must not exceed 25 characters`;
    },
  })
  manufacturer: string;

  @ApiProperty({
    description: propertyMetadata.systemComponentDTOModelVersion.description,
    example: propertyMetadata.systemComponentDTOModelVersion.example,
    name: propertyMetadata.systemComponentDTOModelVersion.fieldLabels.value,
  })
  @IsOptional()
  @MaxLength(15, {
    message: (args: ValidationArguments) => {
      return `The value for [${args.value}] in the Component record [${args.property}] must not exceed 15 characters`;
    },
  })
  modelVersion: string;

  @ApiProperty({
    description: propertyMetadata.systemComponentDTOSerialNumber.description,
    example: propertyMetadata.systemComponentDTOSerialNumber.example,
    name: propertyMetadata.systemComponentDTOSerialNumber.fieldLabels.value,
  })
  @IsOptional()
  @MaxLength(20, {
    message: (args: ValidationArguments) => {
      return `The value for [${args.value}] in the Component record [${args.property}] must not exceed 20 characters`;
    },
  })
  serialNumber: string;

  @ApiProperty({
    description: propertyMetadata.systemComponentDTOHgConverterIndicator.description,
    example: propertyMetadata.systemComponentDTOHgConverterIndicator.example,
    name: propertyMetadata.systemComponentDTOHgConverterIndicator.fieldLabels.value,
  })
  @IsOptional()
  @IsInRange(0, 1, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be within the range of 0 and 1 for [${KEY}]`;
    },
  })
  hgConverterIndicator: number;

  @ApiProperty({
    description: propertyMetadata.systemComponentDTOBeginDate.description,
    example: propertyMetadata.systemComponentDTOBeginDate.example,
    name: propertyMetadata.systemComponentDTOBeginDate.fieldLabels.value,
  })
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('COMPON-3-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @IsInDateRange(MINIMUM_DATE, MAXIMUM_FUTURE_DATE, {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('COMPON-3-B', {
        fieldname: args.property,
        date: args.value,
        key: KEY,
      });
    },
  })
  @IsIsoFormat({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatMessage(
        `The value for [fieldName] in the [key] record must be a valid ISO date format [dateFormat]`,
        {
          fieldName: args.property,
          key: KEY,
          dateFormat: DATE_FORMAT,
        },
      );
    },
  })
  @IsValidDate({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatMessage(
        `[${args.property}] must be a valid date in the format of ${DATE_FORMAT}. You reported an invalid date of [${args.value}]`,
      );
    },
  })
  beginDate: Date;

  @ApiProperty({
    description: propertyMetadata.systemComponentDTOBeginHour.description,
    example: propertyMetadata.systemComponentDTOBeginHour.example,
    name: propertyMetadata.systemComponentDTOBeginHour.fieldLabels.value,
  })
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('COMPON-4-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @IsInRange(MIN_HOUR, MAX_HOUR, {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('COMPON-4-B', {
        fieldname: args.property,
        hour: args.value,
        key: KEY,
      });
    },
  })
  beginHour: number;

  @ApiProperty({
    description: propertyMetadata.systemComponentDTOEndDate.description,
    example: propertyMetadata.systemComponentDTOEndDate.example,
    name: propertyMetadata.systemComponentDTOEndDate.fieldLabels.value,
  })
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('COMPON-7-B', {
        datefield2: args.property,
        hourfield2: 'endHour',
        key: KEY,
      });
    },
  })
  @IsInDateRange(MINIMUM_DATE, MAXIMUM_FUTURE_DATE, {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('COMPON-5-A', {
        fieldname: args.property,
        date: args.value,
        key: KEY,
      });
    },
  })
  @IsIsoFormat({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatMessage(
        `The value for [fieldName] in the [key] record must be a valid ISO date format [dateFormat]`,
        {
          fieldName: args.property,
          key: KEY,
          dateFormat: DATE_FORMAT,
        },
      );
    },
  })
  @IsValidDate({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatMessage(
        `[${args.property}] must be a valid date in the format of ${DATE_FORMAT}. You reported an invalid date of [${args.value}]`,
      );
    },
  })
  @ValidateIf(o => o.endDate !== null || o.endHour !== null)
  endDate: Date;

  @ApiProperty({
    description: propertyMetadata.systemComponentDTOEndHour.description,
    example: propertyMetadata.systemComponentDTOEndHour.example,
    name: propertyMetadata.systemComponentDTOEndHour.fieldLabels.value,
  })
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('COMPON-7-A', {
        hourfield2: args.property,
        datefield2: 'endDate',
        key: KEY,
      });
    },
  })
  @IsInRange(MIN_HOUR, MAX_HOUR, {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('COMPON-6-A', {
        fieldname: args.property,
        hour: args.value,
        key: KEY,
      });
    },
  })
  @BeginEndDatesConsistent({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('COMPON-7-C', {
        datefield2: 'endDate',
        hourfield2: 'endHour',
        datefield1: 'beginDate',
        hourfield1: 'beginHour',
        key: KEY,
      });
    },
  })
  @ValidateIf(o => o.endHour !== null || o.endDate !== null)
  endHour: number;
}

export class SystemComponentDTO extends SystemComponentBaseDTO {
  @ApiProperty({
    description: propertyMetadata.systemComponentDTOId.description,
    example: propertyMetadata.systemComponentDTOId.example,
    name: propertyMetadata.systemComponentDTOId.fieldLabels.value,
  })
  @IsString()
  id: string;

  @ApiProperty({
    description: propertyMetadata.systemComponentDTOLocationId.description,
    example: propertyMetadata.systemComponentDTOLocationId.example,
    name: propertyMetadata.systemComponentDTOLocationId.fieldLabels.value,
  })
  @IsString()
  locationId: string;

  @ApiProperty({
    description:
      propertyMetadata.systemComponentDTOMonitoringSystemRecordId.description,
    example:
      propertyMetadata.systemComponentDTOMonitoringSystemRecordId.example,
    name:
      propertyMetadata.systemComponentDTOMonitoringSystemRecordId.fieldLabels
        .value,
  })
  @IsString()
  monitoringSystemRecordId: string;

  @ApiProperty({
    description:
      propertyMetadata.systemComponentDTOComponentRecordId.description,
    example: propertyMetadata.systemComponentDTOComponentRecordId.example,
    name:
      propertyMetadata.systemComponentDTOComponentRecordId.fieldLabels.value,
  })
  @IsString()
  componentRecordId: string;

  @ApiProperty({
    description: propertyMetadata.systemComponentDTOUserId.description,
    example: propertyMetadata.systemComponentDTOUserId.example,
    name: propertyMetadata.systemComponentDTOUserId.fieldLabels.value,
  })
  @IsString()
  userId: string;

  @ApiProperty({
    description: propertyMetadata.systemComponentDTOAddDate.description,
    example: propertyMetadata.systemComponentDTOAddDate.example,
    name: propertyMetadata.systemComponentDTOAddDate.fieldLabels.value,
  })
  @IsDateString()
  addDate: string;

  @ApiProperty({
    description: propertyMetadata.systemComponentDTOUpdateDate.description,
    example: propertyMetadata.systemComponentDTOUpdateDate.example,
    name: propertyMetadata.systemComponentDTOUpdateDate.fieldLabels.value,
  })
  @IsOptional()
  @IsDateString()
  updateDate: string;

  @ApiProperty({
    description: propertyMetadata.systemComponentDTOActive.description,
    example: propertyMetadata.systemComponentDTOActive.example,
    name: propertyMetadata.systemComponentDTOActive.fieldLabels.value,
  })
  @IsBoolean()
  active: boolean;
}
