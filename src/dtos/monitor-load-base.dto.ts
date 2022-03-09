import {
  IsNotEmpty,
  ValidateIf,
  IsInt,
  ValidationArguments,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';
import { IsInRange, IsIsoFormat } from '@us-epa-camd/easey-common/pipes';
import { IsAtMostDigits } from '../import-checks/pipes/is-at-most-digits.pipe';
import { IsInDbValues } from '../import-checks/pipes/is-in-db-values.pipe';

export class MonitorLoadBaseDTO {
  @ApiProperty({
    description: propertyMetadata.monitorLoadDTOMaximumLoadValue.description,
    example: propertyMetadata.monitorLoadDTOMaximumLoadValue.example,
    name: propertyMetadata.monitorLoadDTOMaximumLoadValue.fieldLabels.value,
  })
  @IsInt()
  @IsAtMostDigits(6, {
    message: (args: ValidationArguments) => {
      return `${args.property} [LOAD-FATAL-A] The value : ${args.value} for ${args.property} must be 6 digits or less`;
    },
  })
  maximumLoadValue: number;

  @ApiProperty({
    description:
      propertyMetadata.monitorLoadDTOMaximumLoadUnitsOfMeasureCode.description,
    example:
      propertyMetadata.monitorLoadDTOMaximumLoadUnitsOfMeasureCode.example,
    name:
      propertyMetadata.monitorLoadDTOMaximumLoadUnitsOfMeasureCode.fieldLabels
        .value,
  })
  @IsInDbValues(
    'SELECT distinct unit_of_measure_code from camdecmpsmd.vw_load_master_data_relationships',
    {
      message: (args: ValidationArguments) => {
        return `${args.property} [LOAD-FATAL-B] The value : ${args.value} for ${args.property} is invalid`;
      },
    },
  )
  maximumLoadUnitsOfMeasureCode: string;

  @ApiProperty({
    description:
      propertyMetadata.monitorLoadDTOLowerOperationBoundary.description,
    example: propertyMetadata.monitorLoadDTOLowerOperationBoundary.example,
    name:
      propertyMetadata.monitorLoadDTOLowerOperationBoundary.fieldLabels.value,
  })
  @IsInt()
  @IsAtMostDigits(6, {
    message: (args: ValidationArguments) => {
      return `${args.property} [LOAD-FATAL-A] The value : ${args.value} for ${args.property} must be 6 digits or less`;
    },
  })
  lowerOperationBoundary: number;

  @ApiProperty({
    description:
      propertyMetadata.monitorLoadDTOUpperOperationBoundary.description,
    example: propertyMetadata.monitorLoadDTOUpperOperationBoundary.example,
    name:
      propertyMetadata.monitorLoadDTOUpperOperationBoundary.fieldLabels.value,
  })
  @IsInt()
  @IsAtMostDigits(6, {
    message: (args: ValidationArguments) => {
      return `${args.property} [LOAD-FATAL-A] The value : ${args.value} for ${args.property} must be 6 digits or less`;
    },
  })
  upperOperationBoundary: number;

  @ApiProperty({
    description: propertyMetadata.monitorLoadDTONormalLevelCode.description,
    example: propertyMetadata.monitorLoadDTONormalLevelCode.example,
    name: propertyMetadata.monitorLoadDTONormalLevelCode.fieldLabels.value,
  })
  @IsInDbValues(
    'SELECT distinct normal_level from camdecmpsmd.vw_load_master_data_relationships',
    {
      message: (args: ValidationArguments) => {
        return `${args.property} [LOAD-FATAL-B] The value : ${args.value} for ${args.property} is invalid`;
      },
    },
  )
  normalLevelCode: string;

  @ApiProperty({
    description: propertyMetadata.monitorLoadDTOSecondLevelCode.description,
    example: propertyMetadata.monitorLoadDTOSecondLevelCode.example,
    name: propertyMetadata.monitorLoadDTOSecondLevelCode.fieldLabels.value,
  })
  @IsInDbValues(
    'SELECT distinct second_level from camdecmpsmd.vw_load_master_data_relationships',
    {
      message: (args: ValidationArguments) => {
        return `${args.property} [LOAD-FATAL-B] The value : ${args.value} for ${args.property} is invalid`;
      },
    },
  )
  secondLevelCode: string;

  @ApiProperty({
    description:
      propertyMetadata.monitorLoadDTOSecondNormalIndicator.description,
    example: propertyMetadata.monitorLoadDTOSecondNormalIndicator.example,
    name:
      propertyMetadata.monitorLoadDTOSecondNormalIndicator.fieldLabels.value,
  })
  @IsInt()
  @IsInRange(0, 1, {
    message: (args: ValidationArguments) => {
      return `${args.property} [LOAD-FATAL-A] The value : ${args.value} for ${args.property} must be within the range of 0 and 1`;
    },
  })
  secondNormalIndicator: number;

  @ApiProperty({
    description: propertyMetadata.monitorLoadDTOLoadAnalysisDate.description,
    example: propertyMetadata.monitorLoadDTOLoadAnalysisDate.example,
    name: propertyMetadata.monitorLoadDTOLoadAnalysisDate.fieldLabels.value,
  })
  @IsIsoFormat({
    message: (args: ValidationArguments) => {
      return `${args.property} [LOAD-FATAL-A] The value : ${args.value} for ${args.property} must be a valid ISO date format yyyy-mm-dd`;
    },
  })
  loadAnalysisDate: Date;

  @ApiProperty({
    description: propertyMetadata.monitorLoadDTOBeginDate.description,
    example: propertyMetadata.monitorLoadDTOBeginDate.example,
    name: propertyMetadata.monitorLoadDTOBeginDate.fieldLabels.value,
  })
  @IsNotEmpty()
  @IsIsoFormat({
    message: (args: ValidationArguments) => {
      return `${args.property} [LOAD-FATAL-A] The value : ${args.value} for ${args.property} must be a valid ISO date format yyyy-mm-dd`;
    },
  })
  beginDate: Date;

  @ApiProperty({
    description: propertyMetadata.monitorLoadDTOBeginHour.description,
    example: propertyMetadata.monitorLoadDTOBeginHour.example,
    name: propertyMetadata.monitorLoadDTOBeginHour.fieldLabels.value,
  })
  @IsNotEmpty()
  @IsInt()
  @IsInRange(0, 23, {
    message: (args: ValidationArguments) => {
      return `${args.property} [LOAD-FATAL-A] The value : ${args.value} for ${args.property} must be within the range of 0 and 23`;
    },
  })
  beginHour: number;

  @ApiProperty({
    description: propertyMetadata.monitorLoadDTOEndDate.description,
    example: propertyMetadata.monitorLoadDTOEndDate.example,
    name: propertyMetadata.monitorLoadDTOEndDate.fieldLabels.value,
  })
  @IsNotEmpty()
  @IsIsoFormat({
    message: (args: ValidationArguments) => {
      return `${args.property} [LOAD-FATAL-A] The value : ${args.value} for ${args.property} must be a valid ISO date format yyyy-mm-dd`;
    },
  })
  @ValidateIf(o => o.endHour !== null)
  endDate: Date;

  @ApiProperty({
    description: propertyMetadata.monitorLoadDTOEndHour.description,
    example: propertyMetadata.monitorLoadDTOEndHour.example,
    name: propertyMetadata.monitorLoadDTOEndHour.fieldLabels.value,
  })
  @IsNotEmpty()
  @IsInt()
  @IsInRange(0, 23, {
    message: (args: ValidationArguments) => {
      return `${args.property} [LOAD-FATAL-A] The value : ${args.value} for ${args.property} must be within the range of 0 and 23`;
    },
  })
  @ValidateIf(o => o.endDate !== null)
  endHour: number;
}
