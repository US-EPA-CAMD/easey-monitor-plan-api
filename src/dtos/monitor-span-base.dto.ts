import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  ValidateIf,
  ValidationArguments,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';
import { IsInRange, IsIsoFormat } from '@us-epa-camd/easey-common/pipes';
import { IsAtMostDigits } from '../import-checks/pipes/is-at-most-digits.pipe';
import { IsInDbValues } from '../import-checks/pipes/is-in-db-values.pipe';

export class MonitorSpanBaseDTO {
  @ApiProperty({
    description: propertyMetadata.monitorSpanDTOComponentTypeCode.description,
    example: propertyMetadata.monitorSpanDTOComponentTypeCode.example,
    name: propertyMetadata.monitorSpanDTOComponentTypeCode.fieldLabels.value,
  })
  @IsInDbValues(
    'SELECT distinct component_type_code as "value" FROM camdecmpsmd.vw_span_master_data_relationships',
    {
      message: (args: ValidationArguments) => {
        return `${args.property} [SPAN-FATAL-B] The value : ${args.value} for ${args.property} is invalid`;
      },
    },
  )
  componentTypeCode: string;

  @ApiProperty({
    description: propertyMetadata.monitorSpanDTOSpanScaleCode.description,
    example: propertyMetadata.monitorSpanDTOSpanScaleCode.example,
    name: propertyMetadata.monitorSpanDTOSpanScaleCode.fieldLabels.value,
  })
  @IsInDbValues(
    'SELECT distinct span_scale_code as "value" FROM camdecmpsmd.vw_span_master_data_relationships',
    {
      message: (args: ValidationArguments) => {
        return `${args.property} [SPAN-FATAL-B] The value : ${args.value} for ${args.property} is invalid`;
      },
    },
  )
  spanScaleCode: string;

  @ApiProperty({
    description: propertyMetadata.monitorSpanDTOSpanMethodCode.description,
    example: propertyMetadata.monitorSpanDTOSpanMethodCode.example,
    name: propertyMetadata.monitorSpanDTOSpanMethodCode.fieldLabels.value,
  })
  @IsInDbValues(
    'SELECT distinct span_method_code as "value" FROM camdecmpsmd.vw_span_master_data_relationships',
    {
      message: (args: ValidationArguments) => {
        return `${args.property} [SPAN-FATAL-B] The value : ${args.value} for ${args.property} is invalid`;
      },
    },
  )
  spanMethodCode: string;

  @ApiProperty({
    description: propertyMetadata.monitorSpanDTOMecValue.description,
    example: propertyMetadata.monitorSpanDTOMecValue.example,
    name: propertyMetadata.monitorSpanDTOMecValue.fieldLabels.value,
  })
  @IsNumber(
    { maxDecimalPlaces: 1 },
    {
      message: (args: ValidationArguments) => {
        return `${args.property} [SPAN-FATAL-A] The value : ${args.value} for ${args.property} is allowed only one decimal place`;
      },
    },
  )
  @IsInRange(-99999.9, 99999.9, {
    message: (args: ValidationArguments) => {
      return `${args.property} [SPAN-FATAL-A] The value : ${args.value} for ${args.property} must be within the range of -99999.9 and 99999.9`;
    },
  })
  mecValue: number;

  @ApiProperty({
    description: propertyMetadata.monitorSpanDTOMpcValue.description,
    example: propertyMetadata.monitorSpanDTOMpcValue.example,
    name: propertyMetadata.monitorSpanDTOMpcValue.fieldLabels.value,
  })
  @IsNumber(
    { maxDecimalPlaces: 1 },
    {
      message: (args: ValidationArguments) => {
        return `${args.property} [SPAN-FATAL-A] The value : ${args.value} for ${args.property} is allowed only one decimal place`;
      },
    },
  )
  @IsInRange(-99999.9, 99999.9, {
    message: (args: ValidationArguments) => {
      return `${args.property} [SPAN-FATAL-A] The value : ${args.value} for ${args.property} must be within the range of -99999.9 and 99999.9`;
    },
  })
  mpcValue: number;

  @ApiProperty({
    description: propertyMetadata.monitorSpanDTOMpfValue.description,
    example: propertyMetadata.monitorSpanDTOMpfValue.example,
    name: propertyMetadata.monitorSpanDTOMpfValue.fieldLabels.value,
  })
  @IsInt()
  @IsAtMostDigits(10, {
    message: (args: ValidationArguments) => {
      return `${args.property} [SPAN-FATAL-A] The value : ${args.value} for ${args.property} must be 10 digits or less`;
    },
  })
  mpfValue: number;

  @ApiProperty({
    description: propertyMetadata.monitorSpanDTOSpanValue.description,
    example: propertyMetadata.monitorSpanDTOSpanValue.example,
    name: propertyMetadata.monitorSpanDTOSpanValue.fieldLabels.value,
  })
  @IsNumber(
    { maxDecimalPlaces: 3 },
    {
      message: (args: ValidationArguments) => {
        return `${args.property} [SPAN-FATAL-A] The value : ${args.value} for ${args.property} is allowed only one decimal place`;
      },
    },
  )
  @IsInRange(-9999999999.999, 9999999999.999, {
    message: (args: ValidationArguments) => {
      return `${args.property} [SPAN-FATAL-A] The value : ${args.value} for ${args.property} must be within the range of -9999999999.999 and 9999999999.999`;
    },
  })
  spanValue: number;

  @IsNumber(
    { maxDecimalPlaces: 3 },
    {
      message: (args: ValidationArguments) => {
        return `${args.property} [SPAN-FATAL-A] The value : ${args.value} for ${args.property} is allowed only one decimal place`;
      },
    },
  )
  @IsInRange(-9999999999.999, 9999999999.999, {
    message: (args: ValidationArguments) => {
      return `${args.property} [SPAN-FATAL-A] The value : ${args.value} for ${args.property} must be within the range of -9999999999.999 and 9999999999.999`;
    },
  })
  @ApiProperty({
    description: propertyMetadata.monitorSpanDTOFullScaleRange.description,
    example: propertyMetadata.monitorSpanDTOFullScaleRange.example,
    name: propertyMetadata.monitorSpanDTOFullScaleRange.fieldLabels.value,
  })
  fullScaleRange: number;

  @ApiProperty({
    description:
      propertyMetadata.monitorSpanDTOSpanUnitsOfMeasureCode.description,
    example: propertyMetadata.monitorSpanDTOSpanUnitsOfMeasureCode.example,
    name:
      propertyMetadata.monitorSpanDTOSpanUnitsOfMeasureCode.fieldLabels.value,
  })
  @IsInDbValues(
    'SELECT distinct unit_of_measure_code as "value" FROM camdecmpsmd.vw_span_master_data_relationships',
    {
      message: (args: ValidationArguments) => {
        return `${args.property} [SPAN-FATAL-B] The value : ${args.value} for ${args.property} is invalid`;
      },
    },
  )
  spanUnitsOfMeasureCode: string;

  @IsNumber(
    { maxDecimalPlaces: 1 },
    {
      message: (args: ValidationArguments) => {
        return `${args.property} [SPAN-FATAL-A] The value : ${args.value} for ${args.property} is allowed only one decimal place`;
      },
    },
  )
  @IsInRange(-99999.9, 99999.9, {
    message: (args: ValidationArguments) => {
      return `${args.property} [SPAN-FATAL-A] The value : ${args.value} for ${args.property} must be within the range of -99999.9 and 99999.9`;
    },
  })
  scaleTransitionPoint: number;

  @ApiProperty({
    description: propertyMetadata.monitorSpanDTODefaultHighRange.description,
    example: propertyMetadata.monitorSpanDTODefaultHighRange.example,
    name: propertyMetadata.monitorSpanDTODefaultHighRange.fieldLabels.value,
  })
  @IsInt()
  @IsAtMostDigits(5, {
    message: (args: ValidationArguments) => {
      return `${args.property} [SPAN-FATAL-A] The value : ${args.value} for ${args.property} must be 5 digits or less`;
    },
  })
  @ValidateIf(o => o.defaultHighRange !== null)
  defaultHighRange: number;

  @ApiProperty({
    description: propertyMetadata.monitorSpanDTOFlowSpanValue.description,
    example: propertyMetadata.monitorSpanDTOFlowSpanValue.example,
    name: propertyMetadata.monitorSpanDTOFlowSpanValue.fieldLabels.value,
  })
  @IsInt()
  @IsAtMostDigits(10, {
    message: (args: ValidationArguments) => {
      return `${args.property} [SPAN-FATAL-A] The value : ${args.value} for ${args.property} must be 10 digits or less`;
    },
  })
  @ValidateIf(o => o.flowSpanValue !== null)
  flowSpanValue: number;

  @ApiProperty({
    description: propertyMetadata.monitorSpanDTOFlowFullScaleRange.description,
    example: propertyMetadata.monitorSpanDTOFlowFullScaleRange.example,
    name: propertyMetadata.monitorSpanDTOFlowFullScaleRange.fieldLabels.value,
  })
  @IsInt()
  @IsAtMostDigits(10, {
    message: (args: ValidationArguments) => {
      return `${args.property} [SPAN-FATAL-A] The value : ${args.value} for ${args.property} must be 10 digits or less`;
    },
  })
  @ValidateIf(o => o.flowFullScaleRange !== null)
  flowFullScaleRange: number;

  @ApiProperty({
    description: propertyMetadata.monitorSpanDTOBeginDate.description,
    example: propertyMetadata.monitorSpanDTOBeginDate.example,
    name: propertyMetadata.monitorSpanDTOBeginDate.fieldLabels.value,
  })
  @IsIsoFormat({
    message: (args: ValidationArguments) => {
      return `${args.property} [ANALYZERRANGE-FATAL-A] The value : ${args.value} for ${args.property} must be a valid ISO date format yyyy-mm-dd`;
    },
  })
  beginDate: Date;

  @ApiProperty({
    description: propertyMetadata.monitorSpanDTOBeginHour.description,
    example: propertyMetadata.monitorSpanDTOBeginHour.example,
    name: propertyMetadata.monitorSpanDTOBeginHour.fieldLabels.value,
  })
  @IsInt()
  @IsInRange(0, 23, {
    message: (args: ValidationArguments) => {
      return `${args.property} [ANALYZERRANGE-FATAL-A] The value : ${args.value} for ${args.property} must be within the range of 0 and 23`;
    },
  })
  beginHour: number;

  @ApiProperty({
    description: propertyMetadata.monitorSpanDTOEndDate.description,
    example: propertyMetadata.monitorSpanDTOEndDate.example,
    name: propertyMetadata.monitorSpanDTOEndDate.fieldLabels.value,
  })
  @IsNotEmpty()
  @IsIsoFormat({
    message: (args: ValidationArguments) => {
      return `${args.property} [ANALYZERRANGE-FATAL-A] The value : ${args.value} for ${args.property} must be a valid ISO date format yyyy-mm-dd`;
    },
  })
  @ValidateIf(o => o.endDate !== null)
  endDate: Date;

  @ApiProperty({
    description: propertyMetadata.monitorSpanDTOEndHour.description,
    example: propertyMetadata.monitorSpanDTOEndHour.example,
    name: propertyMetadata.monitorSpanDTOEndHour.fieldLabels.value,
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
