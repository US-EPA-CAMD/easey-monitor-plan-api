import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  MaxLength,
  ValidateIf,
  ValidationArguments,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';
import { IsInRange, IsIsoFormat } from '@us-epa-camd/easey-common/pipes';
import { IsInDbValues } from '../import-checks/pipes/is-in-db-values.pipe';

export class MonitorDefaultBaseDTO {
  @ApiProperty({
    description: propertyMetadata.monitorDefaultDTOParameterCode.description,
    example: propertyMetadata.monitorDefaultDTOParameterCode.example,
    name: propertyMetadata.monitorDefaultDTOParameterCode.fieldLabels.value,
  })
  @IsInDbValues(
    'SELECT distinct parameter_code as "value" FROM camdecmpsmd.vw_defaults_master_data_relationships',
    {
      message: (args: ValidationArguments) => {
        return `${args.property} [DEFAULT-FATAL-B] The value : ${args.value} for ${args.property} is invalid`;
      },
    },
  )
  parameterCode: string;

  @ApiProperty({
    description: propertyMetadata.monitorDefaultDTODefaultValue.description,
    example: propertyMetadata.monitorDefaultDTODefaultValue.example,
    name: propertyMetadata.monitorDefaultDTODefaultValue.fieldLabels.value,
  })
  @IsNumber(
    { maxDecimalPlaces: 4 },
    {
      message: (args: ValidationArguments) => {
        return `${args.property} [DEFAULT-FATAL-A] The value : ${args.value} for ${args.property} is allowed only one decimal place`;
      },
    },
  )
  @IsInRange(-99999999999.9999, 99999999999.9999, {
    message: (args: ValidationArguments) => {
      return `${args.property} [DEFAULT-FATAL-A] The value : ${args.value} for ${args.property} must be within the range of -99999999999.9999 and 99999999999.9999`;
    },
  })
  defaultValue: number;

  @ApiProperty({
    description:
      propertyMetadata.monitorDefaultDTODefaultUnitsOfMeasureCode.description,
    example:
      propertyMetadata.monitorDefaultDTODefaultUnitsOfMeasureCode.example,
    name:
      propertyMetadata.monitorDefaultDTODefaultUnitsOfMeasureCode.fieldLabels
        .value,
  })
  @IsInDbValues(
    'SELECT distinct unit_of_measure_code as "value" FROM camdecmpsmd.vw_defaults_master_data_relationships',
    {
      message: (args: ValidationArguments) => {
        return `${args.property} [DEFAULT-FATAL-B] The value : ${args.value} for ${args.property} is invalid`;
      },
    },
  )
  defaultUnitsOfMeasureCode: string;

  @ApiProperty({
    description:
      propertyMetadata.monitorDefaultDTODefaultPurposeCode.description,
    example: propertyMetadata.monitorDefaultDTODefaultPurposeCode.example,
    name:
      propertyMetadata.monitorDefaultDTODefaultPurposeCode.fieldLabels.value,
  })
  @IsInDbValues(
    'SELECT distinct purpose_code as "value" FROM camdecmpsmd.vw_defaults_master_data_relationships',
    {
      message: (args: ValidationArguments) => {
        return `${args.property} [DEFAULT-FATAL-B] The value : ${args.value} for ${args.property} is invalid`;
      },
    },
  )
  defaultPurposeCode: string;

  @ApiProperty({
    description: propertyMetadata.monitorDefaultDTOFuelCode.description,
    example: propertyMetadata.monitorDefaultDTOFuelCode.example,
    name: propertyMetadata.monitorDefaultDTOFuelCode.fieldLabels.value,
  })
  @IsInDbValues(
    'SELECT distinct fuel_code as "value" FROM camdecmpsmd.vw_defaults_master_data_relationships',
    {
      message: (args: ValidationArguments) => {
        return `${args.property} [DEFAULT-FATAL-B] The value : ${args.value} for ${args.property} is invalid`;
      },
    },
  )
  fuelCode: string;

  @ApiProperty({
    description:
      propertyMetadata.monitorDefaultDTOOperatingConditionCode.description,
    example: propertyMetadata.monitorDefaultDTOOperatingConditionCode.example,
    name:
      propertyMetadata.monitorDefaultDTOOperatingConditionCode.fieldLabels
        .value,
  })
  @IsInDbValues(
    'SELECT distinct operating_condition_code as "value" FROM camdecmpsmd.vw_defaults_master_data_relationships',
    {
      message: (args: ValidationArguments) => {
        return `${args.property} [DEFAULT-FATAL-B] The value : ${args.value} for ${args.property} is invalid`;
      },
    },
  )
  operatingConditionCode: string;

  @ApiProperty({
    description:
      propertyMetadata.monitorDefaultDTODefaultSourceCode.description,
    example: propertyMetadata.monitorDefaultDTODefaultSourceCode.example,
    name: propertyMetadata.monitorDefaultDTODefaultSourceCode.fieldLabels.value,
  })
  @IsInDbValues(
    'SELECT distinct source_code as "value" FROM camdecmpsmd.vw_defaults_master_data_relationships',
    {
      message: (args: ValidationArguments) => {
        return `${args.property} [DEFAULT-FATAL-B] The value : ${args.value} for ${args.property} is invalid`;
      },
    },
  )
  defaultSourceCode: string;

  @ApiProperty({
    description: propertyMetadata.monitorDefaultDTOGroupId.description,
    example: propertyMetadata.monitorDefaultDTOGroupId.example,
    name: propertyMetadata.monitorDefaultDTOGroupId.fieldLabels.value,
  })
  @MaxLength(10, {
    message: (args: ValidationArguments) => {
      return `${args.property} [DEFAULT-FATAL-A] The value : ${args.value} for ${args.property} must not exceed 10 characters`;
    },
  })
  @ValidateIf(o => o.groupId !== null)
  groupId: string;

  @ApiProperty({
    description: propertyMetadata.monitorDefaultDTOBeginDate.description,
    example: propertyMetadata.monitorDefaultDTOBeginDate.example,
    name: propertyMetadata.monitorDefaultDTOBeginDate.fieldLabels.value,
  })
  @IsIsoFormat({
    message: (args: ValidationArguments) => {
      return `${args.property} [DEFAULT-FATAL-A] The value : ${args.value} for ${args.property} must be a valid ISO date format yyyy-mm-dd`;
    },
  })
  beginDate: Date;

  @ApiProperty({
    description: propertyMetadata.monitorDefaultDTOBeginHour.description,
    example: propertyMetadata.monitorDefaultDTOBeginHour.example,
    name: propertyMetadata.monitorDefaultDTOBeginHour.fieldLabels.value,
  })
  @IsInt()
  @IsInRange(0, 23, {
    message: (args: ValidationArguments) => {
      return `${args.property} [DEFAULT-FATAL-A] The value : ${args.value} for ${args.property} must be within the range of 0 and 23`;
    },
  })
  beginHour: number;

  @ApiProperty({
    description: propertyMetadata.monitorDefaultDTOEndDate.description,
    example: propertyMetadata.monitorDefaultDTOEndDate.example,
    name: propertyMetadata.monitorDefaultDTOEndDate.fieldLabels.value,
  })
  @IsNotEmpty()
  @IsIsoFormat({
    message: (args: ValidationArguments) => {
      return `${args.property} [ANALYZERRANGE-FATAL-A] The value : ${args.value} for ${args.property} must be a valid ISO date format yyyy-mm-dd`;
    },
  })
  @ValidateIf(o => o.endHour !== null)
  endDate: Date;

  @ApiProperty({
    description: propertyMetadata.monitorDefaultDTOEndHour.description,
    example: propertyMetadata.monitorDefaultDTOEndHour.example,
    name: propertyMetadata.monitorDefaultDTOEndHour.fieldLabels.value,
  })
  @IsNotEmpty()
  @IsInt()
  @IsInRange(0, 23, {
    message: (args: ValidationArguments) => {
      return `${args.property} [ANALYZERRANGE-FATAL-A] The value : ${args.value} for ${args.property} must be within the range of 0 and 23`;
    },
  })
  @ValidateIf(o => o.endDate !== null)
  endHour: number;
}
