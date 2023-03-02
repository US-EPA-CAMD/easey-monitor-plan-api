import { ApiProperty } from '@nestjs/swagger';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';

import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  ValidateIf,
  ValidationArguments,
} from 'class-validator';
import { IsInRange } from '@us-epa-camd/easey-common/pipes/is-in-range.pipe';
import { IsIsoFormat } from '@us-epa-camd/easey-common/pipes/is-iso-format.pipe';
import { IsInDbValues } from '../import-checks/pipes/is-in-db-values.pipe';
import { IsInDateRange } from '../import-checks/pipes/is-in-date-range.pipe';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';
import { DATE_FORMAT, MINIMUM_DATE, MAXIMUM_FUTURE_DATE, MAX_HOUR, MIN_HOUR } from '../utilities/constants';

const KEY = 'Monitoring System Fuel Flow';

export class SystemFuelFlowBaseDTO {
  @ApiProperty({
    description:
      propertyMetadata.systemFuelFlowDTOMaximumFuelFlowRate.description,
    example: propertyMetadata.systemFuelFlowDTOMaximumFuelFlowRate.example,
    name:
      propertyMetadata.systemFuelFlowDTOMaximumFuelFlowRate.fieldLabels.value,
  })
  @IsNotEmpty()
  @IsNumber(
    { maxDecimalPlaces: 1 },
    {
      message: (args: ValidationArguments) => {
        return `${args.property} [SYSFUEL-FATAL-A] The value for ${args.value} in the System Fuel Flow record ${args.property} is allowed only one decimal place`;
      },
    },
  )
  @IsInRange(-99999999.9, 99999999.9, {
    message: (args: ValidationArguments) => {
      return `${args.property} [SYSFUEL-FATAL-A] The value for ${args.value} in the System Fuel Flow record ${args.property} must be within the range of -99999999.9 and 99999999.9`;
    },
  })
  maximumFuelFlowRate: number;

  @ApiProperty({
    description:
      propertyMetadata.systemFuelFlowDTOSystemFuelFlowUOMCode.description,
    example: propertyMetadata.systemFuelFlowDTOSystemFuelFlowUOMCode.example,
    name:
      propertyMetadata.systemFuelFlowDTOSystemFuelFlowUOMCode.fieldLabels.value,
  })
  @IsNotEmpty()
  @IsInDbValues(
    'SELECT distinct unit_of_measure_code as "value" FROM camdecmpsmd.vw_systemfuel_master_data_relationships',
    {
      message: (args: ValidationArguments) => {
        return `${args.property} [SYSFUEL-FATAL-B] The value for ${args.value} in the System Fuel Flow record ${args.property} is invalid`;
      },
    },
  )
  systemFuelFlowUOMCode: string;

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
    }
  })
  @IsInDbValues(
    'SELECT distinct max_rate_source_code as "value" FROM camdecmpsmd.vw_systemfuel_master_data_relationships',
    {
      message: (args: ValidationArguments) => {
        return CheckCatalogService.formatResultMessage('FUELFLW-8-B', {
          value: args.value,
          fieldname: args.property,
          key: KEY,
        })
      },
    },
  )
  maximumFuelFlowRateSourceCode: string;

  @ApiProperty({
    description: propertyMetadata.systemFuelFlowDTOBeginDate.description,
    example: propertyMetadata.systemFuelFlowDTOBeginDate.example,
    name: propertyMetadata.systemFuelFlowDTOBeginDate.fieldLabels.value,
  })
  @IsNotEmpty()
  @IsIsoFormat({
    message: (args: ValidationArguments) => {
      return `${args.property} [SYSFUEL-FATAL-A] The value for ${args.value} in the System Fuel Flow record ${args.property} must be a valid ISO date format yyyy-mm-dd`;
    },
  })
  beginDate: Date;

  @ApiProperty({
    description: propertyMetadata.systemFuelFlowDTOBeginHour.description,
    example: propertyMetadata.systemFuelFlowDTOBeginHour.example,
    name: propertyMetadata.systemFuelFlowDTOBeginHour.fieldLabels.value,
  })
  @IsNotEmpty()
  @IsInt()
  @IsInRange(0, 23, {
    message: (args: ValidationArguments) => {
      return `${args.property} [SYSFUEL-FATAL-A] The value for ${args.value} in the System Fuel Flow record ${args.property} must be within the range of 0 and 23`;
    },
  })
  beginHour: number;

  @ApiProperty({
    description: propertyMetadata.systemFuelFlowDTOEndDate.description,
    example: propertyMetadata.systemFuelFlowDTOEndDate.example,
    name: propertyMetadata.systemFuelFlowDTOEndDate.fieldLabels.value,
  })
  @IsOptional()
  @ValidateIf(o => o.endHour !== null)
  @IsIsoFormat({
    message: (args: ValidationArguments) => {
      return `${args.property} [SYSFUEL-FATAL-A] The value for ${args.value} in the System Fuel Flow record ${args.property} must be a valid ISO date format yyyy-mm-dd`;
    },
  })
  @IsInDateRange(MINIMUM_DATE, MAXIMUM_FUTURE_DATE, {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('FUELFLW-5-A', {
        fieldname: args.property,
        date: args.value,
        key: KEY,
      });
    }
  })
  endDate: Date;

  @ApiProperty({
    description: propertyMetadata.systemFuelFlowDTOEndHour.description,
    example: propertyMetadata.systemFuelFlowDTOEndHour.example,
    name: propertyMetadata.systemFuelFlowDTOEndHour.fieldLabels.value,
  })
  @IsOptional()
  @ValidateIf(o => o.endDate !== null)
  @IsInRange(MIN_HOUR, MAX_HOUR, {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('FUELFLW-6-A', {
        fieldname: args.property,
        hour: args.value,
        key: KEY,
      });
    }
  })
  endHour: number;
}

export class SystemFuelFlowDTO extends SystemFuelFlowBaseDTO {
  @ApiProperty({
    description: propertyMetadata.systemFuelFlowDTOId.description,
    example: propertyMetadata.systemFuelFlowDTOId.example,
    name: propertyMetadata.systemFuelFlowDTOId.fieldLabels.value,
  })
  id: string;

  @ApiProperty({
    description:
      propertyMetadata.systemFuelFlowDTOMonitoringSystemRecordId.description,
    example: propertyMetadata.systemFuelFlowDTOMonitoringSystemRecordId.example,
    name:
      propertyMetadata.systemFuelFlowDTOMonitoringSystemRecordId.fieldLabels
        .value,
  })
  monitoringSystemRecordId: string;

  @ApiProperty({
    description: propertyMetadata.systemFuelFlowDTOFuelCode.description,
    example: propertyMetadata.systemFuelFlowDTOFuelCode.example,
    name: propertyMetadata.systemFuelFlowDTOFuelCode.fieldLabels.value,
  })
  fuelCode: string;

  @ApiProperty({
    description: propertyMetadata.systemFuelFlowDTOSystemTypeCode.description,
    example: propertyMetadata.systemFuelFlowDTOSystemTypeCode.example,
    name: propertyMetadata.systemFuelFlowDTOSystemTypeCode.fieldLabels.value,
  })
  systemTypeCode: string;

  @ApiProperty({
    description: propertyMetadata.systemFuelFlowDTOUserId.description,
    example: propertyMetadata.systemFuelFlowDTOUserId.example,
    name: propertyMetadata.systemFuelFlowDTOUserId.fieldLabels.value,
  })
  userId: string;

  @ApiProperty({
    description: propertyMetadata.systemFuelFlowDTOAddDate.description,
    example: propertyMetadata.systemFuelFlowDTOAddDate.example,
    name: propertyMetadata.systemFuelFlowDTOAddDate.fieldLabels.value,
  })
  addDate: Date;

  @ApiProperty({
    description: propertyMetadata.systemFuelFlowDTOUpdateDate.description,
    example: propertyMetadata.systemFuelFlowDTOUpdateDate.example,
    name: propertyMetadata.systemFuelFlowDTOUpdateDate.fieldLabels.value,
  })
  updateDate: Date;

  @ApiProperty({
    description: propertyMetadata.systemFuelFlowDTOActive.description,
    example: propertyMetadata.systemFuelFlowDTOActive.example,
    name: propertyMetadata.systemFuelFlowDTOActive.fieldLabels.value,
  })
  active: boolean;
}
