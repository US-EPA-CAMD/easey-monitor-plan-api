import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
  ValidationArguments,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';

import {
  IsInRange,
  IsIsoFormat,
  IsValidDate,
} from '@us-epa-camd/easey-common/pipes';
import { IsInDbValues } from '../import-checks/pipes/is-in-db-values.pipe';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';
import { IsInDateRange } from '../import-checks/pipes/is-in-date-range.pipe';
import {
  DATE_FORMAT,
  MAX_HOUR,
  MAXIMUM_FUTURE_DATE,
  MIN_HOUR,
  MINIMUM_DATE,
} from '../utilities/constants';
import { BeginEndDatesConsistent } from '../utils';

const KEY = 'Monitoring Method';

export class MonitorMethodBaseDTO {
  @ApiProperty({
    description: propertyMetadata.monitorMethodDTOParameterCode.description,
    example: propertyMetadata.monitorMethodDTOParameterCode.example,
    name: propertyMetadata.monitorMethodDTOParameterCode.fieldLabels.value,
  })
  @IsNotEmpty()
  @IsInDbValues(
    `SELECT distinct parameter_code "value" FROM camdecmpsmd.vw_methods_master_data_relationships`,
    {
      message: (args: ValidationArguments) => {
        return `The value of [${args.value}] for [${args.property}] is invalid for [${KEY}]`;
      },
    },
  )
  parameterCode: string;

  @ApiProperty({
    description:
      propertyMetadata.monitorMethodDTOMonitoringMethodCode.description,
    example: propertyMetadata.monitorMethodDTOMonitoringMethodCode.example,
    name:
      propertyMetadata.monitorMethodDTOMonitoringMethodCode.fieldLabels.value,
  })
  @IsNotEmpty()
  @IsInDbValues(
    `SELECT distinct method_code "value" FROM camdecmpsmd.vw_methods_master_data_relationships`,
    {
      message: (args: ValidationArguments) => {
        return `The value of [${args.value}] for [${args.property}] is invalid for [${KEY}]`;
      },
    },
  )
  monitoringMethodCode: string;

  @ApiProperty({
    description:
      propertyMetadata.monitorMethodDTOSubstituteDataCode.description,
    example: propertyMetadata.monitorMethodDTOSubstituteDataCode.example,
    name: propertyMetadata.monitorMethodDTOSubstituteDataCode.fieldLabels.value,
  })
  @IsOptional()
  @IsInDbValues(
    `SELECT distinct substitute_data_code "value" FROM camdecmpsmd.vw_methods_master_data_relationships`,
    {
      message: (args: ValidationArguments) => {
        return `The value of [${args.value}] for [${args.property}] is invalid for [${KEY}]`;
      },
    },
  )
  substituteDataCode: string;

  @ApiProperty({
    description:
      propertyMetadata.monitorMethodDTOBypassApproachCode.description,
    example: propertyMetadata.monitorMethodDTOBypassApproachCode.example,
    name: propertyMetadata.monitorMethodDTOBypassApproachCode.fieldLabels.value,
  })
  @IsOptional()
  @IsInDbValues(
    `SELECT distinct bypass_approach_code "value" FROM camdecmpsmd.vw_methods_master_data_relationships`,
    {
      message: (args: ValidationArguments) => {
        return `The value of [${args.value}] for [${args.property}] is invalid for [${KEY}]`;
      },
    },
  )
  bypassApproachCode: string;

  @ApiProperty({
    description: propertyMetadata.monitorMethodDTOBeginDate.description,
    example: propertyMetadata.monitorMethodDTOBeginDate.example,
    name: propertyMetadata.monitorMethodDTOBeginDate.fieldLabels.value,
  })
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('METHOD-1-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @IsInDateRange(MINIMUM_DATE, MAXIMUM_FUTURE_DATE, {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('METHOD-1-B', {
        fieldname: args.property,
        date: args.value,
        key: KEY,
      });
    },
  })
  @IsIsoFormat({
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be a valid ISO date format [YYYY-MM-DD] for [${KEY}]`;
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
    description: propertyMetadata.monitorMethodDTOBeginHour.description,
    example: propertyMetadata.monitorMethodDTOBeginHour.example,
    name: propertyMetadata.monitorMethodDTOBeginHour.fieldLabels.value,
  })
  @IsInt()
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('METHOD-2-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @IsInRange(MIN_HOUR, MAX_HOUR, {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('METHOD-2-B', {
        fieldname: args.property,
        hour: args.value,
        key: KEY,
      });
    },
  })
  beginHour: number;

  @ApiProperty({
    description: propertyMetadata.monitorMethodDTOEndDate.description,
    example: propertyMetadata.monitorMethodDTOEndDate.example,
    name: propertyMetadata.monitorMethodDTOEndDate.fieldLabels.value,
  })
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('METHOD-5-B', {
        datefield2: args.property,
        hourfield2: 'endHour',
        key: KEY,
      });
    },
  })
  @IsInDateRange(MINIMUM_DATE, MAXIMUM_FUTURE_DATE, {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('METHOD-3-A', {
        fieldname: args.property,
        date: args.value,
        key: KEY,
      });
    },
  })
  @IsIsoFormat({
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be a valid ISO date format [YYYY-MM-DD] for [${KEY}]`;
    },
  })
  @IsValidDate({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatMessage(
        `[${args.property}] must be a valid date in the format of ${DATE_FORMAT}. You reported an invalid date of [${args.value}]`,
      );
    },
  })
  @ValidateIf(o => o.endHour !== null || o.endDate !== null)
  endDate: Date;

  @ApiProperty({
    description: propertyMetadata.monitorMethodDTOEndHour.description,
    example: propertyMetadata.monitorMethodDTOEndHour.example,
    name: propertyMetadata.monitorMethodDTOEndHour.fieldLabels.value,
  })
  @IsInt()
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('METHOD-5-A', {
        hourfield2: args.property,
        datefield2: 'endDate',
        key: KEY,
      });
    },
  })
  @IsInRange(MIN_HOUR, MAX_HOUR, {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('METHOD-4-A', {
        fieldname: args.property,
        hour: args.value,
        key: KEY,
      });
    },
  })
  @BeginEndDatesConsistent({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('METHOD-5-C', {
        datefield2: 'endDate',
        hourfield2: 'endHour',
        datefield1: 'beginDate',
        hourfield1: 'beginHour',
        key: KEY,
      });
    },
  })
  @ValidateIf(o => o.endDate !== null || o.endHour !== null)
  endHour: number;
}

export class MonitorMethodDTO extends MonitorMethodBaseDTO {
  @ApiProperty({
    description: propertyMetadata.monitorMethodDTOId.description,
    example: propertyMetadata.monitorMethodDTOId.example,
    name: propertyMetadata.monitorMethodDTOId.fieldLabels.value,
  })
  @IsString()
  id: string;

  @ApiProperty({
    description: propertyMetadata.monitorMethodDTOLocationId.description,
    example: propertyMetadata.monitorMethodDTOLocationId.example,
    name: propertyMetadata.monitorMethodDTOLocationId.fieldLabels.value,
  })
  @IsString()
  locationId: string;

  @ApiProperty({
    description: propertyMetadata.monitorMethodDTOUserId.description,
    example: propertyMetadata.monitorMethodDTOUserId.example,
    name: propertyMetadata.monitorMethodDTOUserId.fieldLabels.value,
  })
  @IsString()
  userId: string;

  @ApiProperty({
    description: propertyMetadata.monitorMethodDTOAddDate.description,
    example: propertyMetadata.monitorMethodDTOAddDate.example,
    name: propertyMetadata.monitorMethodDTOAddDate.fieldLabels.value,
  })
  @IsDateString()
  addDate: string;

  @ApiProperty({
    description: propertyMetadata.monitorMethodDTOUpdateDate.description,
    example: propertyMetadata.monitorMethodDTOUpdateDate.example,
    name: propertyMetadata.monitorMethodDTOUpdateDate.fieldLabels.value,
  })
  @IsDateString()
  @IsOptional()
  updateDate: string;

  @ApiProperty({
    description: propertyMetadata.monitorMethodDTOActive.description,
    example: propertyMetadata.monitorMethodDTOActive.example,
    name: propertyMetadata.monitorMethodDTOActive.fieldLabels.value,
  })
  @IsBoolean()
  active: boolean;
}
