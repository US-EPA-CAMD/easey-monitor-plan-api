import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  ValidateIf,
  ValidationArguments,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';
import { IsInRange } from '@us-epa-camd/easey-common/pipes/is-in-range.pipe';
import { IsIsoFormat } from '@us-epa-camd/easey-common/pipes/is-iso-format.pipe';
import { IsInDbValues } from '../import-checks/pipes/is-in-db-values.pipe';

export class SystemFuelFlowBaseDTO {
  @ApiProperty({
    description:
      propertyMetadata.systemFuelFlowDTOMaximumFuelFlowRate.description,
    example: propertyMetadata.systemFuelFlowDTOMaximumFuelFlowRate.example,
    name:
      propertyMetadata.systemFuelFlowDTOMaximumFuelFlowRate.fieldLabels.value,
  })
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
  @IsInDbValues(
    'SELECT distinct max_rate_source_code as "value" FROM camdecmpsmd.vw_systemfuel_master_data_relationships',
    {
      message: (args: ValidationArguments) => {
        return `${args.property} [SYSFUEL-FATAL-B] The value for ${args.value} in the System Fuel Flow record ${args.property} is invalid`;
      },
    },
  )
  maximumFuelFlowRateSourceCode: string;

  @ApiProperty({
    description: propertyMetadata.systemFuelFlowDTOBeginDate.description,
    example: propertyMetadata.systemFuelFlowDTOBeginDate.example,
    name: propertyMetadata.systemFuelFlowDTOBeginDate.fieldLabels.value,
  })
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
  @IsNotEmpty()
  @ValidateIf(o => o.endHour !== null)
  @IsIsoFormat({
    message: (args: ValidationArguments) => {
      return `${args.property} [SYSFUEL-FATAL-A] The value for ${args.value} in the System Fuel Flow record ${args.property} must be a valid ISO date format yyyy-mm-dd`;
    },
  })
  endDate: Date;

  @ApiProperty({
    description: propertyMetadata.systemFuelFlowDTOEndHour.description,
    example: propertyMetadata.systemFuelFlowDTOEndHour.example,
    name: propertyMetadata.systemFuelFlowDTOEndHour.fieldLabels.value,
  })
  @IsNotEmpty()
  @ValidateIf(o => o.endDate !== null)
  @IsInt()
  @IsInRange(0, 23, {
    message: (args: ValidationArguments) => {
      return `${args.property} [SYSFUEL-FATAL-A] The value for ${args.value} in the System Fuel Flow record ${args.property} must be within the range of 0 and 23`;
    },
  })
  endHour: number;
}
