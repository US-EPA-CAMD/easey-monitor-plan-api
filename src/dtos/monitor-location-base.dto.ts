import { ApiProperty } from '@nestjs/swagger';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';
import {
  IsInRange,
  IsIsoFormat,
  IsValidDate,
  MatchesRegEx,
} from '@us-epa-camd/easey-common/pipes';
import {
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  ValidateIf,
  ValidationArguments,
} from 'class-validator';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';
import { DATE_FORMAT } from '../utilities/constants';

const KEY = 'Monitor Location';

export class MonitorLocationBaseDTO {
  @ApiProperty({
    description: propertyMetadata.monitorLocationDTOUnitId.description,
    example: propertyMetadata.monitorLocationDTOUnitId.example,
    name: propertyMetadata.monitorLocationDTOUnitId.fieldLabels.value,
  })
  @IsString()
  @MaxLength(6)
  @MatchesRegEx('^[A-z0-9\\-\\*#]{1,6}$', {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be 1 to 6 characters and only consist of upper and lower case letters, numbers, and the special characters - (dash), * (asterisk), and # (pound) for [${KEY}].`;
    },
  })
  @ValidateIf(o => o.stackPipeId === null)
  unitId: string;

  @ApiProperty({
    description: propertyMetadata.monitorLocationDTOStackPipeId.description,
    example: propertyMetadata.monitorLocationDTOStackPipeId.example,
    name: propertyMetadata.monitorLocationDTOStackPipeId.fieldLabels.value,
  })
  @IsString()
  @MatchesRegEx('^[MC][SP][a-zA-Z0-9\\-]{1,4}$', {
    message: (args: ValidationArguments) => {
      return `[MONLOC-19-B] - The value of [${args.value}] for [${args.property}] must start with CS, CP, MS, or MP and be followed by 1 to 4 alphanumeric characters or dash (-) characters for [${KEY}].`;
    },
  })
  @ValidateIf(o => o.unitId === null)
  stackPipeId: string;

  @ApiProperty({
    description: propertyMetadata.monitorLocationDTOActiveDate.description,
    example: propertyMetadata.monitorLocationDTOActiveDate.example,
    name: propertyMetadata.monitorLocationDTOActiveDate.fieldLabels.value,
  })
  @IsOptional()
  @IsIsoFormat({
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be a valid ISO date format [YYYY-MM-DD] for [${KEY}].`;
    },
  })
  @IsValidDate({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatMessage(
        `[${args.property}] must be a valid date in the format of [${DATE_FORMAT}]. You reported an invalid date of [${args.value}]`,
      );
    },
  })
  activeDate?: Date;

  @ApiProperty({
    description: propertyMetadata.monitorLocationDTORetireDate.description,
    example: propertyMetadata.monitorLocationDTORetireDate.example,
    name: propertyMetadata.monitorLocationDTORetireDate.fieldLabels.value,
  })
  @IsOptional()
  @IsIsoFormat({
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be a valid ISO date format [YYYY-MM-DD] for [${KEY}].`;
    },
  })
  @IsValidDate({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatMessage(
        `[${args.property}] must be a valid date in the format of [${DATE_FORMAT}]. You reported an invalid date of [${args.value}]`,
      );
    },
  })
  retireDate?: Date;

  @ApiProperty({
    description:
      propertyMetadata.monitorLocationDTONonLoadBasedIndicator.description,
    example: propertyMetadata.monitorLocationDTONonLoadBasedIndicator.example,
    name:
      propertyMetadata.monitorLocationDTONonLoadBasedIndicator.fieldLabels
        .value,
  })
  @IsOptional()
  @IsInt()
  @IsInRange(0, 1, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be an integer of 0 and 1 for [${KEY}].`;
    },
  })
  nonLoadBasedIndicator: number;
}
