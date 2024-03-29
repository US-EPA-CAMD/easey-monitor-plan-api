import { ApiProperty } from '@nestjs/swagger';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';
import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidationArguments,
} from 'class-validator';
import {
  IsIsoFormat,
  IsValidCode,
  IsValidDate,
  MatchesRegEx,
} from '@us-epa-camd/easey-common/pipes';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';
import { IsInDateRange } from '../import-checks/pipes/is-in-date-range.pipe';
import {
  DATE_FORMAT,
  MAXIMUM_FUTURE_DATE,
  MINIMUM_DATE,
} from '../utilities/constants';
import { VwUnitcontrolMasterDataRelationships } from '../entities/vw-unitcontrol-master-data-relationships.entity';
import { ControlCode } from '../entities/control-code.entity';

const KEY = 'Unit Control';

export class UnitControlBaseDTO {
  // TODO: update contorlEquipParamCode to parameterCode in easey-common
  // @ApiProperty({
  //   description: propertyMetadata.parameterCode.description,
  //   example: propertyMetadata.parameterCode.example,
  //   name: propertyMetadata.parameterCode.fieldLabels.value,
  // })
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('CONTROL-1-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @IsValidCode(VwUnitcontrolMasterDataRelationships, {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('CONTROL-1-B', {
        fieldname: args.property,
        value: args.value,
        key: KEY,
      });
    },
  })
  parameterCode: string;

  @ApiProperty({
    description: propertyMetadata.unitControlDTOControlCode.description,
    example: propertyMetadata.unitControlDTOControlCode.example,
    name: propertyMetadata.unitControlDTOControlCode.fieldLabels.value,
  })
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('CONTROL-2-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @IsValidCode(ControlCode, {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatMessage(
        'The value for [controlCode] in the Unit Control record [fieldname] is invalid',
        {
          fieldname: args.property,
          controlCode: args.value,
        },
      );
    },
  })
  controlCode: string;

  @ApiProperty({
    description: propertyMetadata.unitControlDTOOriginalCode.description,
    example: propertyMetadata.unitControlDTOOriginalCode.example,
    name: propertyMetadata.unitControlDTOOriginalCode.fieldLabels.value,
  })
  @IsOptional()
  @IsString()
  @MatchesRegEx('^[01]$', {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be 1 character consisting 1 or 0.`;
    },
  })
  originalCode: string;

  @ApiProperty({
    description: propertyMetadata.unitControlDTOInstallDate.description,
    example: propertyMetadata.unitControlDTOInstallDate.example,
    name: propertyMetadata.unitControlDTOInstallDate.fieldLabels.value,
  })
  @IsOptional()
  @IsIsoFormat({
    message: (args: ValidationArguments) => {
      return `The value for [${args.value}] in the Unit Control record [${args.property}] must be a valid ISO date format [${DATE_FORMAT}]`;
    },
  })
  @IsInDateRange('1930-01-01', MAXIMUM_FUTURE_DATE, {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('CONTROL-5-B', {
        fieldname: args.property,
        date: args.value,
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
  installDate: Date;

  @ApiProperty({
    description: propertyMetadata.unitControlDTOOptimizationDate.description,
    example: propertyMetadata.unitControlDTOOptimizationDate.example,
    name: propertyMetadata.unitControlDTOOptimizationDate.fieldLabels.value,
  })
  @IsOptional()
  @IsIsoFormat({
    message: (args: ValidationArguments) => {
      return `The value for [${args.value}] in the Unit Control record [${args.property}] must be a valid ISO date format [${DATE_FORMAT}]`;
    },
  })
  @IsValidDate({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatMessage(
        `[${args.property}] must be a valid date in the format of ${DATE_FORMAT}. You reported an invalid date of [${args.value}]`,
      );
    },
  })
  optimizationDate: Date;

  @ApiProperty({
    description:
      propertyMetadata.unitControlDTOSeasonalControlsIndicator.description,
    example: propertyMetadata.unitControlDTOSeasonalControlsIndicator.example,
    name:
      propertyMetadata.unitControlDTOSeasonalControlsIndicator.fieldLabels
        .value,
  })
  @IsOptional()
  @MatchesRegEx('^[01]$', {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be 1 character consisting 1 or 0.`;
    },
  })
  seasonalControlsIndicator: string;

  @ApiProperty({
    description: propertyMetadata.unitControlDTORetireDate.description,
    example: propertyMetadata.unitControlDTORetireDate.example,
    name: propertyMetadata.unitControlDTORetireDate.fieldLabels.value,
  })
  @IsOptional()
  @IsInDateRange(MINIMUM_DATE, MAXIMUM_FUTURE_DATE, {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('CONTROL-6-A', {
        fieldname: args.property,
        date: args.value,
        key: KEY,
      });
    },
  })
  @IsIsoFormat({
    message: (args: ValidationArguments) => {
      return `The value for [${args.value}] in the Unit Control record [${args.property}] must be a valid ISO date format ${DATE_FORMAT}.`;
    },
  })
  @IsValidDate({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatMessage(
        `[${args.property}] must be a valid date in the format of ${DATE_FORMAT}. You reported an invalid date of [${args.value}]`,
      );
    },
  })
  retireDate: Date;
}

export class UnitControlDTO extends UnitControlBaseDTO {
  @ApiProperty({
    description: propertyMetadata.unitControlDTOId.description,
    example: propertyMetadata.unitControlDTOId.example,
    name: propertyMetadata.unitControlDTOId.fieldLabels.value,
  })
  @IsString()
  id: string;

  @ApiProperty({
    description: propertyMetadata.unitControlDTOUnitId.description,
    example: propertyMetadata.unitControlDTOUnitId.example,
    name: propertyMetadata.unitControlDTOUnitId.fieldLabels.value,
  })
  @IsNumber()
  unitRecordId: number;

  @ApiProperty({
    description: propertyMetadata.unitControlDTOUserId.description,
    example: propertyMetadata.unitControlDTOUserId.example,
    name: propertyMetadata.unitControlDTOUserId.fieldLabels.value,
  })
  @IsString()
  userId: string;

  @ApiProperty({
    description: propertyMetadata.unitControlDTOAddDate.description,
    example: propertyMetadata.unitControlDTOAddDate.example,
    name: propertyMetadata.unitControlDTOAddDate.fieldLabels.value,
  })
  @IsDateString()
  addDate: string;

  @ApiProperty({
    description: propertyMetadata.unitControlDTOUpdateDate.description,
    example: propertyMetadata.unitControlDTOUpdateDate.example,
    name: propertyMetadata.unitControlDTOUpdateDate.fieldLabels.value,
  })
  @IsDateString()
  @IsOptional()
  updateDate: string;

  @ApiProperty({
    description: propertyMetadata.unitControlDTOActive.description,
    example: propertyMetadata.unitControlDTOActive.example,
    name: propertyMetadata.unitControlDTOActive.fieldLabels.value,
  })
  @IsBoolean()
  active: boolean;
}
