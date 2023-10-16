import { ApiProperty } from '@nestjs/swagger';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';
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
  MAXIMUM_FUTURE_DATE,
  MINIMUM_DATE,
} from '../utilities/constants';
import { BeginEndDatesConsistent } from '../utils';

const KEY = 'Monitoring Location Attribute';

export class MonitorAttributeBaseDTO {
  @ApiProperty({
    description: propertyMetadata.monitorAttributeDTODuctIndicator.description,
    example: propertyMetadata.monitorAttributeDTODuctIndicator.example,
    name: propertyMetadata.monitorAttributeDTODuctIndicator.fieldLabels.value,
  })
  @IsOptional()
  @IsInt()
  @IsInRange(0, 1, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be an integer of 0 and 1 for [${KEY}]`;
    },
  })
  ductIndicator: number;

  @ApiProperty({
    description:
      propertyMetadata.monitorAttributeDTOBypassIndicator.description,
    example: propertyMetadata.monitorAttributeDTOBypassIndicator.example,
    name: propertyMetadata.monitorAttributeDTOBypassIndicator.fieldLabels.value,
  })
  @IsOptional()
  @IsInRange(0, 1, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be an integer of 0 and 1 for [${KEY}]`;
    },
  })
  bypassIndicator: number;

  @ApiProperty({
    description:
      propertyMetadata.monitorAttributeDTOGroundElevation.description,
    example: propertyMetadata.monitorAttributeDTOGroundElevation.example,
    name: propertyMetadata.monitorAttributeDTOGroundElevation.fieldLabels.value,
  })
  @IsOptional()
  @IsInt()
  @IsInRange(-100, 15000, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be within the range of -100 and 15000 for [${KEY}]`;
    },
  })
  groundElevation: number;

  @ApiProperty({
    description: propertyMetadata.monitorAttributeDTOStackHeight.description,
    example: propertyMetadata.monitorAttributeDTOStackHeight.example,
    name: propertyMetadata.monitorAttributeDTOStackHeight.fieldLabels.value,
  })
  @IsOptional()
  @IsInt()
  @IsInRange(20, 1600, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be within the range of 20 and 1600 for [${KEY}]`;
    },
  })
  stackHeight: number;

  @ApiProperty({
    description: propertyMetadata.monitorAttributeDTOMaterialCode.description,
    example: propertyMetadata.monitorAttributeDTOMaterialCode.example,
    name: propertyMetadata.monitorAttributeDTOMaterialCode.fieldLabels.value,
  })
  @IsOptional()
  @IsInDbValues(
    'SELECT material_cd as "value" FROM camdecmpsmd.material_code',
    {
      message: (args: ValidationArguments) => {
        return `The value for [${args.value}] in the Monitoring Location Attributes record [${args.property}] is invalid`;
      },
    },
  )
  materialCode: string;

  @ApiProperty({
    description: propertyMetadata.monitorAttributeDTOShapeCode.description,
    example: propertyMetadata.monitorAttributeDTOShapeCode.example,
    name: propertyMetadata.monitorAttributeDTOShapeCode.fieldLabels.value,
  })
  @IsOptional()
  @IsInDbValues('SELECT shape_cd as "value" FROM camdecmpsmd.shape_code', {
    message: (args: ValidationArguments) => {
      return `The value for [${args.value}] in the Monitoring Location Attributes record [${args.property}] is invalid`;
    },
  })
  shapeCode: string;

  @ApiProperty({
    description: propertyMetadata.monitorAttributeDTOCrossAreaFlow.description,
    example: propertyMetadata.monitorAttributeDTOCrossAreaFlow.example,
    name: propertyMetadata.monitorAttributeDTOCrossAreaFlow.fieldLabels.value,
  })
  @IsOptional()
  @IsInt()
  @IsInRange(5, 1700, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be within the range of 5 and 1700 for [${KEY}]`;
    },
  })
  crossAreaFlow: number;

  @ApiProperty({
    description:
      propertyMetadata.monitorAttributeDTOCrossAreaStackExit.description,
    example: propertyMetadata.monitorAttributeDTOCrossAreaStackExit.example,
    name:
      propertyMetadata.monitorAttributeDTOCrossAreaStackExit.fieldLabels.value,
  })
  @IsOptional()
  @IsInt()
  @IsInRange(0, 9999, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be within the range of 0 and 9999 for [${KEY}]`;
    },
  })
  crossAreaStackExit: number;

  @ApiProperty({
    description: propertyMetadata.monitorAttributeDTOBeginDate.description,
    example: propertyMetadata.monitorAttributeDTOBeginDate.example,
    name: propertyMetadata.monitorAttributeDTOBeginDate.fieldLabels.value,
  })
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('MONLOC-11-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @IsInDateRange(MINIMUM_DATE, MAXIMUM_FUTURE_DATE, {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('MONLOC-11-B', {
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
    description: propertyMetadata.monitorAttributeDTOEndDate.description,
    example: propertyMetadata.monitorAttributeDTOEndDate.example,
    name: propertyMetadata.monitorAttributeDTOEndDate.fieldLabels.value,
  })
  @IsInDateRange(MINIMUM_DATE, MAXIMUM_FUTURE_DATE, {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('MONLOC-12-A', {
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
  @BeginEndDatesConsistent({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('MONLOC-76-A', {
        datefield2: 'endDate',
        datefield1: 'beginDate',
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
  @ValidateIf(o => o.endDate !== null)
  endDate: Date;
}

export class MonitorAttributeDTO extends MonitorAttributeBaseDTO {
  @ApiProperty({
    description: propertyMetadata.monitorAttributeDTOId.description,
    example: propertyMetadata.monitorAttributeDTOId.example,
    name: propertyMetadata.monitorAttributeDTOId.fieldLabels.value,
  })
  @IsString()
  id: string;

  @ApiProperty({
    description: propertyMetadata.monitorAttributeDTOLocationId.description,
    example: propertyMetadata.monitorAttributeDTOLocationId.example,
    name: propertyMetadata.monitorAttributeDTOLocationId.fieldLabels.value,
  })
  @IsString()
  locationId: string;

  @ApiProperty({
    description: propertyMetadata.monitorAttributeDTOUserId.description,
    example: propertyMetadata.monitorAttributeDTOUserId.example,
    name: propertyMetadata.monitorAttributeDTOUserId.fieldLabels.value,
  })
  @IsString()
  userId: string;

  @ApiProperty({
    description: propertyMetadata.monitorAttributeDTOAddDate.description,
    example: propertyMetadata.monitorAttributeDTOAddDate.example,
    name: propertyMetadata.monitorAttributeDTOAddDate.fieldLabels.value,
  })
  @IsDateString()
  addDate: string;

  @ApiProperty({
    description: propertyMetadata.monitorAttributeDTOUpdateDate.description,
    example: propertyMetadata.monitorAttributeDTOUpdateDate.example,
    name: propertyMetadata.monitorAttributeDTOUpdateDate.fieldLabels.value,
  })
  @IsDateString()
  @IsOptional()
  updateDate: string;

  @ApiProperty({
    description: propertyMetadata.monitorAttributeDTOActive.description,
    example: propertyMetadata.monitorAttributeDTOActive.example,
    name: propertyMetadata.monitorAttributeDTOActive.fieldLabels.value,
  })
  @IsBoolean()
  active: boolean;
}
