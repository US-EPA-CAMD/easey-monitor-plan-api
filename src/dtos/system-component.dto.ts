import { ApiProperty } from '@nestjs/swagger';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';

import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
  ValidationArguments,
} from 'class-validator';
import { ComponentBaseDTO } from './component.dto';
import { IsInRange } from '@us-epa-camd/easey-common/pipes/is-in-range.pipe';
import { IsIsoFormat } from '@us-epa-camd/easey-common/pipes';
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

const KEY = 'System Component';

export class SystemComponentBaseDTO extends ComponentBaseDTO {
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
  @ValidateIf(o => o.endDate !== null || o.endHour !== null)
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
  endDate: Date;

  @ApiProperty({
    description: propertyMetadata.systemComponentDTOEndHour.description,
    example: propertyMetadata.systemComponentDTOEndHour.example,
    name: propertyMetadata.systemComponentDTOEndHour.fieldLabels.value,
  })
  @ValidateIf(o => o.endHour !== null || o.endDate !== null)
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
