import { ApiProperty } from '@nestjs/swagger';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';

import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
  ValidateIf,
  ValidationArguments,
} from 'class-validator';
import { IsInRange, IsIsoFormat } from '@us-epa-camd/easey-common/pipes';
import { IsAtMostDigits } from '../import-checks/pipes/is-at-most-digits.pipe';
import { IsInDbValues } from '../import-checks/pipes/is-in-db-values.pipe';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';
import {
  DATE_FORMAT,
  MAXIMUM_FUTURE_DATE,
  MAX_HOUR,
  MINIMUM_DATE,
  MIN_HOUR,
} from '../utilities/constants';
import { IsInDateRange } from '../import-checks/pipes/is-in-date-range.pipe';

const KEY = 'Monitor Span';
const MPF_MIN_VALUE = 500000;

export class MonitorSpanBaseDTO {
  @ApiProperty({
    description: propertyMetadata.monitorSpanDTOComponentTypeCode.description,
    example: propertyMetadata.monitorSpanDTOComponentTypeCode.example,
    name: propertyMetadata.monitorSpanDTOComponentTypeCode.fieldLabels.value,
  })
  @IsNotEmpty()
  @IsInDbValues(
    'SELECT distinct component_type_code as "value" FROM camdecmpsmd.vw_span_master_data_relationships',
    {
      message: (args: ValidationArguments) => {
        return `${args.property} The value : ${args.value} for ${args.property} is invalid`;
      },
    },
  )
  componentTypeCode: string;

  @ApiProperty({
    description: propertyMetadata.monitorSpanDTOSpanScaleCode.description,
    example: propertyMetadata.monitorSpanDTOSpanScaleCode.example,
    name: propertyMetadata.monitorSpanDTOSpanScaleCode.fieldLabels.value,
  })
  @IsOptional()
  @IsInDbValues(
    'SELECT distinct span_scale_code as "value" FROM camdecmpsmd.vw_span_master_data_relationships',
    {
      message: (args: ValidationArguments) => {
        return `${args.property} The value : ${args.value} for ${args.property} is invalid`;
      },
    },
  )
  spanScaleCode: string;

  @ApiProperty({
    description: propertyMetadata.monitorSpanDTOSpanMethodCode.description,
    example: propertyMetadata.monitorSpanDTOSpanMethodCode.example,
    name: propertyMetadata.monitorSpanDTOSpanMethodCode.fieldLabels.value,
  })
  @IsOptional()
  @IsInDbValues(
    'SELECT distinct span_method_code as "value" FROM camdecmpsmd.vw_span_master_data_relationships',
    {
      message: (args: ValidationArguments) => {
        return `${args.property} The value : ${args.value} for ${args.property} is invalid`;
      },
    },
  )
  spanMethodCode: string;

  @ApiProperty({
    description: propertyMetadata.monitorSpanDTOMecValue.description,
    example: propertyMetadata.monitorSpanDTOMecValue.example,
    name: propertyMetadata.monitorSpanDTOMecValue.fieldLabels.value,
  })
  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 1 },
    {
      message: (args: ValidationArguments) => {
        return `${args.property} The value : ${args.value} for ${args.property} is allowed only one decimal place`;
      },
    },
  )
  @IsInRange(-99999.9, 99999.9, {
    message: (args: ValidationArguments) => {
      return `${args.property} The value : ${args.value} for ${args.property} must be within the range of -99999.9 and 99999.9`;
    },
  })
  mecValue: number;

  @ApiProperty({
    description: propertyMetadata.monitorSpanDTOMpcValue.description,
    example: propertyMetadata.monitorSpanDTOMpcValue.example,
    name: propertyMetadata.monitorSpanDTOMpcValue.fieldLabels.value,
  })
  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 1 },
    {
      message: (args: ValidationArguments) => {
        return `${args.property} The value : ${args.value} for ${args.property} is allowed only one decimal place`;
      },
    },
  )
  @IsInRange(-99999.9, 99999.9, {
    message: (args: ValidationArguments) => {
      return `${args.property} The value : ${args.value} for ${args.property} must be within the range of -99999.9 and 99999.9`;
    },
  })
  mpcValue: number;

  @ApiProperty({
    description: propertyMetadata.monitorSpanDTOMpfValue.description,
    example: propertyMetadata.monitorSpanDTOMpfValue.example,
    name: propertyMetadata.monitorSpanDTOMpfValue.fieldLabels.value,
  })
  @IsAtMostDigits(10, {
    message: (args: ValidationArguments) => {
      return `${args.property} The value : ${args.value} for ${args.property} must be 10 digits or less`;
    },
  })
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('SPAN-3-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @Min(MPF_MIN_VALUE, {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('SPAN-3-B', {
        key: KEY,
      });
    },
  })
  @ValidateIf(o => o.componentTypeCode === 'FLOW')
  mpfValue: number;

  @ApiProperty({
    description: propertyMetadata.monitorSpanDTOSpanValue.description,
    example: propertyMetadata.monitorSpanDTOSpanValue.example,
    name: propertyMetadata.monitorSpanDTOSpanValue.fieldLabels.value,
  })
  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 3 },
    {
      message: (args: ValidationArguments) => {
        return `${args.property} The value : ${args.value} for ${args.property} is allowed only one decimal place`;
      },
    },
  )
  @IsInRange(-9999999999.999, 9999999999.999, {
    message: (args: ValidationArguments) => {
      return `${args.property} The value : ${args.value} for ${args.property} must be within the range of -9999999999.999 and 9999999999.999`;
    },
  })
  spanValue: number;

  @ApiProperty({
    description: propertyMetadata.monitorSpanDTOFullScaleRange.description,
    example: propertyMetadata.monitorSpanDTOFullScaleRange.example,
    name: propertyMetadata.monitorSpanDTOFullScaleRange.fieldLabels.value,
  })
  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 3 },
    {
      message: (args: ValidationArguments) => {
        return `${args.property} The value : ${args.value} for ${args.property} is allowed only one decimal place`;
      },
    },
  )
  @IsInRange(-9999999999.999, 9999999999.999, {
    message: (args: ValidationArguments) => {
      return `${args.property} The value : ${args.value} for ${args.property} must be within the range of -9999999999.999 and 9999999999.999`;
    },
  })
  fullScaleRange: number;

  @ApiProperty({
    description:
      propertyMetadata.monitorSpanDTOSpanUnitsOfMeasureCode.description,
    example: propertyMetadata.monitorSpanDTOSpanUnitsOfMeasureCode.example,
    name:
      propertyMetadata.monitorSpanDTOSpanUnitsOfMeasureCode.fieldLabels.value,
  })
  @IsOptional()
  @IsInDbValues(
    'SELECT distinct unit_of_measure_code as "value" FROM camdecmpsmd.vw_span_master_data_relationships',
    {
      message: (args: ValidationArguments) => {
        return `${args.property} The value : ${args.value} for ${args.property} is invalid`;
      },
    },
  )
  spanUnitsOfMeasureCode: string;

  // TODO: add api property definition for monitor-span scaleTransitionPoint
  // @ApiProperty({
  //   description:
  //     propertyMetadata.monitorSpanDTOScaleTransitionPoint.description,
  //   example: propertyMetadata.monitorSpanDTOScaleTransitionPoint.example,
  //   name: propertyMetadata.monitorSpanDTOScaleTransitionPoint.fieldLabels.value,
  // })
  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 1 },
    {
      message: (args: ValidationArguments) => {
        return `${args.property} The value : ${args.value} for ${args.property} is allowed only one decimal place`;
      },
    },
  )
  @IsInRange(-99999.9, 99999.9, {
    message: (args: ValidationArguments) => {
      return `${args.property} The value : ${args.value} for ${args.property} must be within the range of -99999.9 and 99999.9`;
    },
  })
  scaleTransitionPoint: number;

  @ApiProperty({
    description: propertyMetadata.monitorSpanDTODefaultHighRange.description,
    example: propertyMetadata.monitorSpanDTODefaultHighRange.example,
    name: propertyMetadata.monitorSpanDTODefaultHighRange.fieldLabels.value,
  })
  @IsOptional()
  @IsInt()
  @IsAtMostDigits(5, {
    message: (args: ValidationArguments) => {
      return `${args.property} The value : ${args.value} for ${args.property} must be 5 digits or less`;
    },
  })
  @ValidateIf(o => o.defaultHighRange !== null)
  defaultHighRange: number;

  @ApiProperty({
    description: propertyMetadata.monitorSpanDTOFlowSpanValue.description,
    example: propertyMetadata.monitorSpanDTOFlowSpanValue.example,
    name: propertyMetadata.monitorSpanDTOFlowSpanValue.fieldLabels.value,
  })
  @IsOptional()
  @IsInt()
  @IsAtMostDigits(10, {
    message: (args: ValidationArguments) => {
      return `${args.property} The value : ${args.value} for ${args.property} must be 10 digits or less`;
    },
  })
  @ValidateIf(o => o.flowSpanValue !== null)
  flowSpanValue: number;

  @ApiProperty({
    description: propertyMetadata.monitorSpanDTOFlowFullScaleRange.description,
    example: propertyMetadata.monitorSpanDTOFlowFullScaleRange.example,
    name: propertyMetadata.monitorSpanDTOFlowFullScaleRange.fieldLabels.value,
  })
  @IsOptional()
  @IsInt()
  @IsAtMostDigits(10, {
    message: (args: ValidationArguments) => {
      return `${args.property} The value : ${args.value} for ${args.property} must be 10 digits or less`;
    },
  })
  @ValidateIf(o => o.flowFullScaleRange !== null)
  flowFullScaleRange: number;

  @ApiProperty({
    description: propertyMetadata.monitorSpanDTOBeginDate.description,
    example: propertyMetadata.monitorSpanDTOBeginDate.example,
    name: propertyMetadata.monitorSpanDTOBeginDate.fieldLabels.value,
  })
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('SPAN-8-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @IsInDateRange(MINIMUM_DATE, MAXIMUM_FUTURE_DATE, {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('SPAN-8-B', {
        fieldname: args.property,
        date: args.value,
        key: KEY,
      });
    },
  })
  @IsIsoFormat({
    message: (args: ValidationArguments) => {
      return `The value : ${args.value} for ${args.property} must be a valid ISO date format  ${DATE_FORMAT}`;
    },
  })
  beginDate: Date;

  @ApiProperty({
    description: propertyMetadata.monitorSpanDTOBeginHour.description,
    example: propertyMetadata.monitorSpanDTOBeginHour.example,
    name: propertyMetadata.monitorSpanDTOBeginHour.fieldLabels.value,
  })
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('SPAN-9-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @IsInRange(MIN_HOUR, MAX_HOUR, {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('SPAN-9-B', {
        fieldname: args.property,
        hour: args.value,
        key: KEY,
      });
    },
  })
  beginHour: number;

  @ApiProperty({
    description: propertyMetadata.monitorSpanDTOEndDate.description,
    example: propertyMetadata.monitorSpanDTOEndDate.example,
    name: propertyMetadata.monitorSpanDTOEndDate.fieldLabels.value,
  })
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('SPAN-10-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @IsInDateRange(MINIMUM_DATE, MAXIMUM_FUTURE_DATE, {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('SPAN-10-A', {
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
  @ValidateIf(o => o.endDate !== null)
  endDate: Date;

  @ApiProperty({
    description: propertyMetadata.monitorSpanDTOEndHour.description,
    example: propertyMetadata.monitorSpanDTOEndHour.example,
    name: propertyMetadata.monitorSpanDTOEndHour.fieldLabels.value,
  })
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('SPAN-11-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @IsInRange(MIN_HOUR, MAX_HOUR, {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('SPAN-11-B', {
        fieldname: args.property,
        hour: args.value,
        key: KEY,
      });
    },
  })
  @ValidateIf(o => o.endDate !== null)
  endHour: number;
}

export class MonitorSpanDTO extends MonitorSpanBaseDTO {
  @ApiProperty({
    description: propertyMetadata.monitorSpanDTOId.description,
    example: propertyMetadata.monitorSpanDTOId.example,
    name: propertyMetadata.monitorSpanDTOId.fieldLabels.value,
  })
  id: string;

  @ApiProperty({
    description: propertyMetadata.monitorSpanDTOLocationId.description,
    example: propertyMetadata.monitorSpanDTOLocationId.example,
    name: propertyMetadata.monitorSpanDTOLocationId.fieldLabels.value,
  })
  locationId: string;

  @ApiProperty({
    description: propertyMetadata.monitorSpanDTOUserid.description,
    example: propertyMetadata.monitorSpanDTOUserid.example,
    name: propertyMetadata.monitorSpanDTOUserid.fieldLabels.value,
  })
  userid: string;

  @ApiProperty({
    description: propertyMetadata.monitorSpanDTOAddDate.description,
    example: propertyMetadata.monitorSpanDTOAddDate.example,
    name: propertyMetadata.monitorSpanDTOAddDate.fieldLabels.value,
  })
  addDate: Date;

  @ApiProperty({
    description: propertyMetadata.monitorSpanDTOUpdateDate.description,
    example: propertyMetadata.monitorSpanDTOUpdateDate.example,
    name: propertyMetadata.monitorSpanDTOUpdateDate.fieldLabels.value,
  })
  updateDate: Date;

  @ApiProperty({
    description: propertyMetadata.monitorSpanDTOActive.description,
    example: propertyMetadata.monitorSpanDTOActive.example,
    name: propertyMetadata.monitorSpanDTOActive.fieldLabels.value,
  })
  active: boolean;
}
