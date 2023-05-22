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
  ValidateIf,
  ValidationArguments,
} from 'class-validator';
import { IsInRange, IsIsoFormat } from '@us-epa-camd/easey-common/pipes';
import { IsInDbValues } from '../import-checks/pipes/is-in-db-values.pipe';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';
import { IsInDateRange } from '../import-checks/pipes/is-in-date-range.pipe';
import { MAXIMUM_FUTURE_DATE, MINIMUM_DATE } from '../utilities/constants';
import { BeginEndDatesConsistent } from '../utils';

const KEY = 'Unit Fuel';

export class UnitFuelBaseDTO {
  @ApiProperty({
    description: propertyMetadata.unitFuelDTOFuelCode.description,
    example: propertyMetadata.unitFuelDTOFuelCode.example,
    name: propertyMetadata.unitFuelDTOFuelCode.fieldLabels.value,
  })
  @IsNotEmpty()
  @IsInDbValues(
    'SELECT distinct fuel_type_cd as "value" FROM camdecmpsmd.vw_unitfuel_master_data_relationships',
    {
      message: (args: ValidationArguments) => {
        return `The value for ${args.value} in the Unit Fuel record ${args.property} is invalid`;
      },
    },
  )
  fuelCode: string;

  @ApiProperty({
    description: propertyMetadata.unitFuelDTOIndicatorCode.description,
    example: propertyMetadata.unitFuelDTOIndicatorCode.example,
    name: propertyMetadata.unitFuelDTOIndicatorCode.fieldLabels.value,
  })
  @IsOptional()
  @IsInDbValues(
    'SELECT distinct fuel_indicator_cd as "value" FROM camdecmpsmd.vw_unitfuel_master_data_relationships',
    {
      message: (args: ValidationArguments) => {
        return `The value for ${args.value} in the Unit Fuel record ${args.property} is invalid`;
      },
    },
  )
  indicatorCode: string;

  @ApiProperty({
    description: propertyMetadata.unitFuelDTOOzoneSeasonIndicator.description,
    example: propertyMetadata.unitFuelDTOOzoneSeasonIndicator.example,
    name: propertyMetadata.unitFuelDTOOzoneSeasonIndicator.fieldLabels.value,
  })
  @IsOptional()
  @IsInt()
  @IsInRange(0, 1, {
    message: (args: ValidationArguments) => {
      return `The value for ${args.value}  in the Unit Fuel record ${args.property} must be within the range of 0 and 1`;
    },
  })
  ozoneSeasonIndicator: number;

  @ApiProperty({
    description: propertyMetadata.unitFuelDTODemGCV.description,
    example: propertyMetadata.unitFuelDTODemGCV.example,
    name: propertyMetadata.unitFuelDTODemGCV.fieldLabels.value,
  })
  @IsOptional()
  @IsInDbValues(
    'SELECT distinct dem_gcv as "value" FROM camdecmpsmd.vw_unitfuel_master_data_relationships',
    {
      message: (args: ValidationArguments) => {
        return `The value for ${args.value} in the Unit Fuel record ${args.property} is invalid`;
      },
    },
  )
  demGCV: string;

  @ApiProperty({
    description: propertyMetadata.unitFuelDTODemSO2.description,
    example: propertyMetadata.unitFuelDTODemSO2.example,
    name: propertyMetadata.unitFuelDTODemSO2.fieldLabels.value,
  })
  @IsOptional()
  @IsInDbValues(
    'SELECT distinct dem_so2 as "value" FROM camdecmpsmd.vw_unitfuel_master_data_relationships',
    {
      message: (args: ValidationArguments) => {
        return `The value for ${args.value} in the Unit Fuel record ${args.property} is invalid`;
      },
    },
  )
  demSO2: string;

  @ApiProperty({
    description: propertyMetadata.unitFuelDTOBeginDate.description,
    example: propertyMetadata.unitFuelDTOBeginDate.example,
    name: propertyMetadata.unitFuelDTOBeginDate.fieldLabels.value,
  })
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('FUEL-42-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @IsInDateRange('1930-01-01', MAXIMUM_FUTURE_DATE, {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('FUEL-42-B', {
        fieldname: args.property,
        date: args.value,
        key: KEY,
      });
    },
  })
  @IsIsoFormat({
    message: (args: ValidationArguments) => {
      return `The value for ${args.value} in the Unit Fuel record ${args.property} must be a valid ISO date format yyyy-mm-dd`;
    },
  })
  beginDate: Date;

  @ApiProperty({
    description: propertyMetadata.unitFuelDTOEndDate.description,
    example: propertyMetadata.unitFuelDTOEndDate.example,
    name: propertyMetadata.unitFuelDTOEndDate.fieldLabels.value,
  })
  @ValidateIf(o => o.endDate !== null)
  @IsInDateRange(MINIMUM_DATE, MAXIMUM_FUTURE_DATE, {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('FUEL-43-A', {
        fieldname: args.property,
        date: args.value,
        key: KEY,
      });
    },
  })
  @IsIsoFormat({
    message: (args: ValidationArguments) => {
      return `The value for ${args.value} in the Unit Fuel record ${args.property} must be a valid ISO date format yyyy-mm-dd`;
    },
  })
  @BeginEndDatesConsistent({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('FUEL-44-A', {
        datefield2: 'endDate',
        datefield1: 'beginDate',
        key: KEY,
      });
    },
  })
  endDate: Date;
}

export class UnitFuelDTO extends UnitFuelBaseDTO {
  @ApiProperty({
    description: propertyMetadata.unitFuelDTOId.description,
    example: propertyMetadata.unitFuelDTOId.example,
    name: propertyMetadata.unitFuelDTOId.fieldLabels.value,
  })
  @IsString()
  id: string;

  @ApiProperty({
    description: propertyMetadata.unitFuelDTOUnitId.description,
    example: propertyMetadata.unitFuelDTOUnitId.example,
    name: propertyMetadata.unitFuelDTOUnitId.fieldLabels.value,
  })
  @IsNumber()
  unitRecordId: number;

  @ApiProperty({
    description: propertyMetadata.unitFuelDTOActualOrProjectCode.description,
    example: propertyMetadata.unitFuelDTOActualOrProjectCode.example,
    name: propertyMetadata.unitFuelDTOActualOrProjectCode.fieldLabels.value,
  })
  @IsString()
  @IsOptional()
  actualOrProjectCode: string;

  @ApiProperty({
    description: propertyMetadata.unitFuelDTOSulfurContent.description,
    example: propertyMetadata.unitFuelDTOSulfurContent.example,
    name: propertyMetadata.unitFuelDTOSulfurContent.fieldLabels.value,
  })
  @IsNumber()
  @IsOptional()
  sulfurContent: number;

  @ApiProperty({
    description: propertyMetadata.unitFuelDTOUserId.description,
    example: propertyMetadata.unitFuelDTOUserId.example,
    name: propertyMetadata.unitFuelDTOUserId.fieldLabels.value,
  })
  @IsString()
  userId: string;

  @ApiProperty({
    description: propertyMetadata.unitFuelDTOAddDate.description,
    example: propertyMetadata.unitFuelDTOAddDate.example,
    name: propertyMetadata.unitFuelDTOAddDate.fieldLabels.value,
  })
  @IsDateString()
  addDate: string;

  @ApiProperty({
    description: propertyMetadata.unitFuelDTOUpdateDate.description,
    example: propertyMetadata.unitFuelDTOUpdateDate.example,
    name: propertyMetadata.unitFuelDTOUpdateDate.fieldLabels.value,
  })
  @IsDateString()
  @IsOptional()
  updateDate: string;

  @ApiProperty({
    description: propertyMetadata.unitFuelDTOActive.description,
    example: propertyMetadata.unitFuelDTOActive.example,
    name: propertyMetadata.unitFuelDTOActive.fieldLabels.value,
  })
  @IsBoolean()
  active: boolean;
}
