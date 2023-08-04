import { ApiProperty } from '@nestjs/swagger';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';
import { IsInRange, IsIsoFormat } from '@us-epa-camd/easey-common/pipes';
import {
  IsBoolean,
  IsDate,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
  ValidationArguments,
} from 'class-validator';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';
import { IsInDateRange } from '../import-checks/pipes/is-in-date-range.pipe';
import { MAXIMUM_FUTURE_DATE, MINIMUM_DATE } from '../utilities/constants';
import { BeginEndDatesConsistent } from '../utils';

const KEY = 'Unit Capacity';

export class UnitCapacityBaseDTO {
  @ApiProperty({
    description:
      propertyMetadata.unitCapacityDTOMaximumHourlyHeatInputCapacity
        .description,
    example:
      propertyMetadata.unitCapacityDTOMaximumHourlyHeatInputCapacity.example,
    name:
      propertyMetadata.unitCapacityDTOMaximumHourlyHeatInputCapacity.fieldLabels
        .value,
  })
  @IsNumber(
    { maxDecimalPlaces: 1 },
    {
      message: (args: ValidationArguments) => {
        return `${args.property} [UNITCAPACITY-FATAL-A] The value : ${args.value} for ${args.property} is allowed only one decimal place`;
      },
    },
  )
  @IsInRange(-999999.9, 999999.9, {
    message: (args: ValidationArguments) => {
      return `${args.property} [UNITCAPACITY-FATAL-A] The value : ${args.value} for ${args.property} must be within the range of -99999.9 and 99999.9`;
    },
  })
  maximumHourlyHeatInputCapacity: number;

  @ApiProperty({
    description: propertyMetadata.unitCapacityDTOBeginDate.description,
    example: propertyMetadata.unitCapacityDTOBeginDate.example,
    name: propertyMetadata.unitCapacityDTOBeginDate.fieldLabels.value,
  })
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('CAPAC-5-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @IsInDateRange('1930-01-01', MAXIMUM_FUTURE_DATE, {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('CAPAC-5-B', {
        fieldname: args.property,
        date: args.value,
        key: KEY,
      });
    },
  })
  @IsIsoFormat({
    message: (args: ValidationArguments) => {
      return `${args.property} [UNITCAPACITY-FATAL-A] The value : ${args.value} for ${args.property} must be a valid ISO date format yyyy-mm-dd`;
    },
  })
  beginDate: Date;

  @ApiProperty({
    description: propertyMetadata.unitCapacityDTOEndDate.description,
    example: propertyMetadata.unitCapacityDTOEndDate.example,
    name: propertyMetadata.unitCapacityDTOEndDate.fieldLabels.value,
  })
  @ValidateIf(o => o.endDate !== null)
  @IsInDateRange(MINIMUM_DATE, MAXIMUM_FUTURE_DATE, {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('CAPAC-2-A', {
        fieldname: args.property,
        date: args.value,
        key: KEY,
      });
    },
  })
  @IsIsoFormat({
    message: (args: ValidationArguments) => {
      return `${args.property} [UNITCAPACITY-FATAL-A] The value : ${args.value} for ${args.property} must be a valid ISO date format yyyy-mm-dd`;
    },
  })
  @BeginEndDatesConsistent({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('CAPAC-1-A', {
        datefield2: 'endDate',
        datefield1: 'beginDate',
        key: KEY,
      });
    },
  })
  endDate: Date;
}

export class UnitCapacityDTO extends UnitCapacityBaseDTO {
  @ApiProperty({
    description: propertyMetadata.unitCapacityDTOId.description,
    example: propertyMetadata.unitCapacityDTOId.example,
    name: propertyMetadata.unitCapacityDTOId.fieldLabels.value,
  })
  @IsString()
  id: string;

  @ApiProperty({
    description: propertyMetadata.unitCapacityDTOUnitId.description,
    example: propertyMetadata.unitCapacityDTOUnitId.example,
    name: propertyMetadata.unitCapacityDTOUnitId.fieldLabels.value,
  })
  @IsNumber()
  unitRecordId: number;

  @ApiProperty({
    description: propertyMetadata.commercialOperationDate.description,
    example: propertyMetadata.commercialOperationDate.example,
    name: propertyMetadata.commercialOperationDate.fieldLabels.value,
  })
  @IsDateString()
  @IsOptional()
  commercialOperationDate: Date;

  @ApiProperty({
    description: propertyMetadata.date.description,
    example: propertyMetadata.date.example,
    name: propertyMetadata.date.fieldLabels.value,
  })
  @IsDateString()
  @IsOptional()
  operationDate: Date;

  @IsString()
  boilerTurbineType: string;

  @ApiProperty({
    description: propertyMetadata.unitCapacityDTOBeginDate.description,
    example: propertyMetadata.unitCapacityDTOBeginDate.example,
    name: propertyMetadata.unitCapacityDTOBeginDate.fieldLabels.value,
  })
  @IsDateString()
  boilerTurbineBeginDate: Date;

  @ApiProperty({
    description: propertyMetadata.unitCapacityDTOEndDate.description,
    example: propertyMetadata.unitCapacityDTOEndDate.example,
    name: propertyMetadata.unitCapacityDTOEndDate.fieldLabels.value,
  })
  @IsDateString()
  @IsOptional()
  boilerTurbineEndDate: Date;

  @ApiProperty({
    description: propertyMetadata.unitCapacityDTOUserId.description,
    example: propertyMetadata.unitCapacityDTOUserId.example,
    name: propertyMetadata.unitCapacityDTOUserId.fieldLabels.value,
  })
  @IsString()
  userId: string;

  @ApiProperty({
    description: propertyMetadata.unitCapacityDTOAddDate.description,
    example: propertyMetadata.unitCapacityDTOAddDate.example,
    name: propertyMetadata.unitCapacityDTOAddDate.fieldLabels.value,
  })
  @IsDateString()
  addDate: string;

  @ApiProperty({
    description: propertyMetadata.unitCapacityDTOUpdateDate.description,
    example: propertyMetadata.unitCapacityDTOUpdateDate.example,
    name: propertyMetadata.unitCapacityDTOUpdateDate.fieldLabels.value,
  })
  @IsDateString()
  @IsOptional()
  updateDate: string;

  @ApiProperty({
    description: propertyMetadata.unitCapacityDTOActive.description,
    example: propertyMetadata.unitCapacityDTOActive.example,
    name: propertyMetadata.unitCapacityDTOActive.fieldLabels.value,
  })
  @IsBoolean()
  active: boolean;
}
