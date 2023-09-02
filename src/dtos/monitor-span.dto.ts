import { ApiProperty } from '@nestjs/swagger';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';

import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateIf,
  ValidationArguments,
} from 'class-validator';
import {
  IsInRange,
  IsIsoFormat,
  IsValidCode,
} from '@us-epa-camd/easey-common/pipes';
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
import { VwSpanMasterDataRelationships } from '../entities/vw-span-master-data-relationships.entity';
import { BeginEndDatesConsistent } from '../utils';

const KEY = 'Monitor Span';
const MPF_MIN_VALUE = 500000;

export class MonitorSpanBaseDTO {
  @ApiProperty({
    description: propertyMetadata.monitorSpanDTOComponentTypeCode.description,
    example: propertyMetadata.monitorSpanDTOComponentTypeCode.example,
    name: propertyMetadata.monitorSpanDTOComponentTypeCode.fieldLabels.value,
  })
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('SPAN-20-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @IsValidCode(VwSpanMasterDataRelationships, {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('SPAN-20-B', {
        value: args.value,
        fieldname: args.property,
        key: KEY,
      });
    },
  })
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
        return `[${args.property}] The value : [${args.value}] for [${args.property}] is invalid`;
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
        return `[${args.property}] The value : [${args.value}] for [${args.property}] is invalid`;
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
        return `The value of [${args.value}] for [${args.property}] is allowed only one decimal place for [${KEY}].`;
      },
    },
  )
  @IsInRange(0, 99999.9, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be within the range of 0 and 99999.9 for [${KEY}].`;
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
        return `The value of [${args.value}] for [${args.property}] is allowed only one decimal place for [${KEY}].`;
      },
    },
  )
  @IsInRange(0, 99999.9, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be within the range of 0 and 99999.9 for [${KEY}].`;
    },
  })
  mpcValue: number;

  @ApiProperty({
    description: propertyMetadata.monitorSpanDTOMpfValue.description,
    example: propertyMetadata.monitorSpanDTOMpfValue.example,
    name: propertyMetadata.monitorSpanDTOMpfValue.fieldLabels.value,
  })
  @IsInRange(MPF_MIN_VALUE, 9999999999, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be within the range of ${MPF_MIN_VALUE} and 9999999999 for [${KEY}].`;
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
  @ValidateIf(o => o.componentTypeCode === 'FLOW' || o.mpfValue !== null)
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
        return `The value of [${args.value}] for [${args.property}] is allowed only three decimal place for [${KEY}].`;
      },
    },
  )
  @IsInRange(0, 9999999999.999, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be within the range of 0.000 and 9999999999.999 for [${KEY}]`;
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
        return `The value of [${args.value}] for [${args.property}] is allowed only three decimal place for [${KEY}].`;
      },
    },
  )
  @IsInRange(0.0, 9999999999.999, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be within the range of 0.000 and 9999999999.999 for [${KEY}].`;
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
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('SPAN-21-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @IsInDbValues(
    'SELECT distinct unit_of_measure_code as "value" FROM camdecmpsmd.vw_span_master_data_relationships',
    {
      message: (args: ValidationArguments) => {
        return `The value of [${args.value}] for [${args.property}] is invalid for [${KEY}].`;
      },
    },
  )
  spanUnitsOfMeasureCode: string;

  @ApiProperty({
    description:
      propertyMetadata.monitorSpanDTOScaleTransitionPoint.description,
    example: propertyMetadata.monitorSpanDTOScaleTransitionPoint.example,
    name: propertyMetadata.monitorSpanDTOScaleTransitionPoint.fieldLabels.value,
  })
  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 1 },
    {
      message: (args: ValidationArguments) => {
        return `The value of [${args.value}] for [${args.property}] is allowed only one decimal place for [${KEY}].`;
      },
    },
  )
  @IsInRange(0, 99999.9, {
    message: (args: ValidationArguments) => {
      return `The value [${args.value}] for [${args.property}] must be within the range of 0 and 99999.9 for [${KEY}].`;
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
  @IsInRange(0, 99999, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be in the range 0 and 99999 for [${KEY}].`;
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
  @IsInRange(0, 9999999999, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be in the range 0 and 9999999999 for [${KEY}].`;
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
  @IsInRange(0, 9999999999, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be in the range 0 and 9999999999 for [${KEY}].`;
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
  @ValidateIf(o => o.endDate !== null || o.endHour !== null)
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('SPAN-12-B', {
        datefield2: args.property,
        hourfield2: 'endHour',
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
  endDate: Date;

  @ApiProperty({
    description: propertyMetadata.monitorSpanDTOEndHour.description,
    example: propertyMetadata.monitorSpanDTOEndHour.example,
    name: propertyMetadata.monitorSpanDTOEndHour.fieldLabels.value,
  })
  @ValidateIf(o => o.endDate !== null || o.endHour !== null)
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('SPAN-12-A', {
        hourfield2: args.property,
        datefield2: 'endDate',
        key: KEY,
      });
    },
  })
  @IsInRange(MIN_HOUR, MAX_HOUR, {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('SPAN-11-A', {
        fieldname: args.property,
        hour: args.value,
        key: KEY,
      });
    },
  })
  @BeginEndDatesConsistent({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('SPAN-12-C', {
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

export class MonitorSpanDTO extends MonitorSpanBaseDTO {
  @ApiProperty({
    description: propertyMetadata.monitorSpanDTOId.description,
    example: propertyMetadata.monitorSpanDTOId.example,
    name: propertyMetadata.monitorSpanDTOId.fieldLabels.value,
  })
  @IsString()
  id: string;

  @ApiProperty({
    description: propertyMetadata.monitorSpanDTOLocationId.description,
    example: propertyMetadata.monitorSpanDTOLocationId.example,
    name: propertyMetadata.monitorSpanDTOLocationId.fieldLabels.value,
  })
  @IsString()
  locationId: string;

  @ApiProperty({
    description: propertyMetadata.monitorSpanDTOUserid.description,
    example: propertyMetadata.monitorSpanDTOUserid.example,
    name: propertyMetadata.monitorSpanDTOUserid.fieldLabels.value,
  })
  @IsString()
  userid: string;

  @ApiProperty({
    description: propertyMetadata.monitorSpanDTOAddDate.description,
    example: propertyMetadata.monitorSpanDTOAddDate.example,
    name: propertyMetadata.monitorSpanDTOAddDate.fieldLabels.value,
  })
  @IsDateString()
  addDate: string;

  @ApiProperty({
    description: propertyMetadata.monitorSpanDTOUpdateDate.description,
    example: propertyMetadata.monitorSpanDTOUpdateDate.example,
    name: propertyMetadata.monitorSpanDTOUpdateDate.fieldLabels.value,
  })
  @IsDateString()
  @IsOptional()
  updateDate: string;

  @ApiProperty({
    description: propertyMetadata.monitorSpanDTOActive.description,
    example: propertyMetadata.monitorSpanDTOActive.example,
    name: propertyMetadata.monitorSpanDTOActive.fieldLabels.value,
  })
  @IsBoolean()
  active: boolean;
}
