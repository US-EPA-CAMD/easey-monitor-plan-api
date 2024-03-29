import { ApiProperty } from '@nestjs/swagger';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';

import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
  ValidationArguments,
} from 'class-validator';
import {
  IsInRange,
  IsIsoFormat,
  IsValidCode,
  IsValidDate,
} from '@us-epa-camd/easey-common/pipes';
import { IsInDbValues } from '../import-checks/pipes/is-in-db-values.pipe';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';
import {
  MINIMUM_DATE,
  MAXIMUM_FUTURE_DATE,
  MAX_HOUR,
  MIN_HOUR,
  DATE_FORMAT,
} from '../utilities/constants';
import { SystemFuelMasterDataRelationship } from '../entities/system-fuel-md-relationship.entity';
import { FindManyOptions } from 'typeorm';
import { IsInDateRange } from '../import-checks/pipes/is-in-date-range.pipe';
import { BeginEndDatesConsistent } from '../utils';

const KEY = 'Monitoring System Fuel Flow';

export class SystemFuelFlowBaseDTO {
  @ApiProperty({
    description:
      propertyMetadata.systemFuelFlowDTOMaximumFuelFlowRate.description,
    example: propertyMetadata.systemFuelFlowDTOMaximumFuelFlowRate.example,
    name:
      propertyMetadata.systemFuelFlowDTOMaximumFuelFlowRate.fieldLabels.value,
  })
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('FUELFLW-2-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @IsInRange(
    0,
    99999999.9,
    {
      message: (args: ValidationArguments) => {
        return CheckCatalogService.formatResultMessage('FUELFLW-2-B', {
          value: args.value,
          fieldname: args.property,
          key: KEY,
        });
      },
    },
    false,
  )
  @IsNumber(
    { maxDecimalPlaces: 1 },
    {
      message: (args: ValidationArguments) => {
        return `The value of [${args.value}] for [${args.property}] is allowed only one decimal place for [${KEY}].`;
      },
    },
  )
  maximumFuelFlowRate: number;

  @ApiProperty({
    description:
      propertyMetadata.systemFuelFlowDTOSystemFuelFlowUOMCode.description,
    example: propertyMetadata.systemFuelFlowDTOSystemFuelFlowUOMCode.example,
    name:
      propertyMetadata.systemFuelFlowDTOSystemFuelFlowUOMCode.fieldLabels.value,
  })
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('FUELFLW-10-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @IsInDbValues(
    'SELECT distinct unit_of_measure_code as "value" FROM camdecmpsmd.vw_systemfuel_master_data_relationships',
    {
      message: (args: ValidationArguments) => {
        return `The value of [${args.value}] for [${args.property}] is invalid for [${KEY}].`;
      },
    },
  )
  systemFuelFlowUnitsOfMeasureCode: string;

  @ApiProperty({
    description:
      propertyMetadata.systemFuelFlowDTOMaximumFuelFlowRateSourceCode
        .description,
    example:
      propertyMetadata.systemFuelFlowDTOMaximumFuelFlowRateSourceCode.example,
    name:
      propertyMetadata.systemFuelFlowDTOMaximumFuelFlowRateSourceCode
        .fieldLabels.value,
  })
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('FUELFLW-8-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @IsValidCode(
    SystemFuelMasterDataRelationship,
    {
      message: (args: ValidationArguments) => {
        return CheckCatalogService.formatResultMessage('FUELFLW-8-B', {
          value: args.value,
          fieldname: args.property,
          key: KEY,
        });
      },
    },
    (args: ValidationArguments): FindManyOptions<any> => {
      return { where: { maxRateSourceCode: args.value } };
    },
  )
  maximumFuelFlowRateSourceCode: string;

  @ApiProperty({
    description: propertyMetadata.systemFuelFlowDTOBeginDate.description,
    example: propertyMetadata.systemFuelFlowDTOBeginDate.example,
    name: propertyMetadata.systemFuelFlowDTOBeginDate.fieldLabels.value,
  })
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('FUELFLW-3-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @IsInDateRange(MINIMUM_DATE, MAXIMUM_FUTURE_DATE, {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('FUELFLW-3-B', {
        fieldname: args.property,
        date: args.value,
        key: KEY,
      });
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
    description: propertyMetadata.systemFuelFlowDTOBeginHour.description,
    example: propertyMetadata.systemFuelFlowDTOBeginHour.example,
    name: propertyMetadata.systemFuelFlowDTOBeginHour.fieldLabels.value,
  })
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('FUELFLW-4-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @IsInRange(MIN_HOUR, MAX_HOUR, {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('FUELFLW-4-B', {
        fieldname: args.property,
        hour: args.value,
        key: KEY,
      });
    },
  })
  beginHour: number;

  @ApiProperty({
    description: propertyMetadata.systemFuelFlowDTOEndDate.description,
    example: propertyMetadata.systemFuelFlowDTOEndDate.example,
    name: propertyMetadata.systemFuelFlowDTOEndDate.fieldLabels.value,
  })
  @IsIsoFormat({
    message: (args: ValidationArguments) => {
      return `The value to [${args.value}] for [${args.property}] must be a valid ISO date format [YYYY-MM-DD] for [${KEY}]`;
    },
  })
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('FUELFLW-7-B', {
        hourfield2: 'endHour',
        datefield2: args.property,
        key: KEY,
      });
    },
  })
  @IsInDateRange(MINIMUM_DATE, MAXIMUM_FUTURE_DATE, {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('FUELFLW-5-A', {
        fieldname: args.property,
        date: args.value,
        key: KEY,
      });
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
    description: propertyMetadata.systemFuelFlowDTOEndHour.description,
    example: propertyMetadata.systemFuelFlowDTOEndHour.example,
    name: propertyMetadata.systemFuelFlowDTOEndHour.fieldLabels.value,
  })
  @IsInRange(MIN_HOUR, MAX_HOUR, {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('FUELFLW-6-A', {
        fieldname: args.property,
        hour: args.value,
        key: KEY,
      });
    },
  })
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('FUELFLW-7-A', {
        hourfield2: args.property,
        datefield2: 'endDate',
        key: KEY,
      });
    },
  })
  @BeginEndDatesConsistent({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('FUELFLW-7-C', {
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

export class SystemFuelFlowDTO extends SystemFuelFlowBaseDTO {
  @ApiProperty({
    description: propertyMetadata.systemFuelFlowDTOId.description,
    example: propertyMetadata.systemFuelFlowDTOId.example,
    name: propertyMetadata.systemFuelFlowDTOId.fieldLabels.value,
  })
  @IsString()
  id: string;

  @ApiProperty({
    description:
      propertyMetadata.systemFuelFlowDTOMonitoringSystemRecordId.description,
    example: propertyMetadata.systemFuelFlowDTOMonitoringSystemRecordId.example,
    name:
      propertyMetadata.systemFuelFlowDTOMonitoringSystemRecordId.fieldLabels
        .value,
  })
  @IsString()
  monitoringSystemRecordId: string;

  @ApiProperty({
    description: propertyMetadata.systemFuelFlowDTOFuelCode.description,
    example: propertyMetadata.systemFuelFlowDTOFuelCode.example,
    name: propertyMetadata.systemFuelFlowDTOFuelCode.fieldLabels.value,
  })
  @IsString()
  fuelCode: string;

  @ApiProperty({
    description: propertyMetadata.systemFuelFlowDTOSystemTypeCode.description,
    example: propertyMetadata.systemFuelFlowDTOSystemTypeCode.example,
    name: propertyMetadata.systemFuelFlowDTOSystemTypeCode.fieldLabels.value,
  })
  @IsString()
  systemTypeCode: string;

  @ApiProperty({
    description: propertyMetadata.systemFuelFlowDTOUserId.description,
    example: propertyMetadata.systemFuelFlowDTOUserId.example,
    name: propertyMetadata.systemFuelFlowDTOUserId.fieldLabels.value,
  })
  @IsString()
  userId: string;

  @ApiProperty({
    description: propertyMetadata.systemFuelFlowDTOAddDate.description,
    example: propertyMetadata.systemFuelFlowDTOAddDate.example,
    name: propertyMetadata.systemFuelFlowDTOAddDate.fieldLabels.value,
  })
  @IsDateString()
  addDate: string;

  @ApiProperty({
    description: propertyMetadata.systemFuelFlowDTOUpdateDate.description,
    example: propertyMetadata.systemFuelFlowDTOUpdateDate.example,
    name: propertyMetadata.systemFuelFlowDTOUpdateDate.fieldLabels.value,
  })
  @IsOptional()
  @IsDateString()
  updateDate: string;

  @ApiProperty({
    description: propertyMetadata.systemFuelFlowDTOActive.description,
    example: propertyMetadata.systemFuelFlowDTOActive.example,
    name: propertyMetadata.systemFuelFlowDTOActive.fieldLabels.value,
  })
  @IsBoolean()
  active: boolean;
}
