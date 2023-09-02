import { ApiProperty } from '@nestjs/swagger';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';
import {
  IsInRange,
  IsIsoFormat,
  IsValidDate,
} from '@us-epa-camd/easey-common/pipes';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateIf,
  ValidationArguments,
} from 'class-validator';
import { MatchesRegEx } from '../import-checks/pipes/matches-regex.pipe';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';
import { DATE_FORMAT } from 'src/utilities/constants';

const KEY = 'Monitor Location';

export class MonitorLocationBaseDTO {
  @ApiProperty({
    description: propertyMetadata.monitorLocationDTOUnitId.description,
    example: propertyMetadata.monitorLocationDTOUnitId.example,
    name: propertyMetadata.monitorLocationDTOUnitId.fieldLabels.value,
  })
  @IsOptional()
  @IsString()
  @MaxLength(6)
  @MatchesRegEx('^[A-z0-9\\-\\*#]{1,6}$', {
    message: (args: ValidationArguments) => {
      return `The value of ${args.value} for ${args.property} must be match the RegEx: [A-z0-9-*#]{1,6} for ${KEY}.`;
    },
  })
  @ValidateIf(o => o.stackPipeId === null)
  unitId: string;

  @ApiProperty({
    description: propertyMetadata.monitorLocationDTOStackPipeId.description,
    example: propertyMetadata.monitorLocationDTOStackPipeId.example,
    name: propertyMetadata.monitorLocationDTOStackPipeId.fieldLabels.value,
  })
  @IsOptional()
  @IsString()
  @MatchesRegEx('^(C|c|M|m|X|x)(S|s|P|p)[A-z0-9\\-]{1,6}$', {
    message: (args: ValidationArguments) => {
      return `The value of ${args.value} for ${args.property} must be match the RegEx: (C|c|M|m|X|x)(S|s|P|p)[A-z0-9-]{1,4} for ${KEY}.`;
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
      return `The value of ${args.value} for ${args.property} must be a valid ISO date format yyyy-mm-dd for ${KEY}.`;
    },
  })
  @IsValidDate({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatMessage(
        `${args.property} must be a valid date in the format of ${DATE_FORMAT}. You reported an invalid date of ${args.value}`,
      );
    },
  })
  activeDate: Date;

  @ApiProperty({
    description: propertyMetadata.monitorLocationDTORetireDate.description,
    example: propertyMetadata.monitorLocationDTORetireDate.example,
    name: propertyMetadata.monitorLocationDTORetireDate.fieldLabels.value,
  })
  @IsOptional()
  @IsIsoFormat({
    message: (args: ValidationArguments) => {
      return `The value of ${args.value} for ${args.property} must be a valid ISO date format yyyy-mm-dd for ${KEY}.`;
    },
  })
  @IsValidDate({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatMessage(
        `${args.property} must be a valid date in the format of ${DATE_FORMAT}. You reported an invalid date of ${args.value}`,
      );
    },
  })
  retireDate: Date;

  @ApiProperty({
    description:
      propertyMetadata.monitorLocationDTONonLoadBasedIndicator.description,
    example: propertyMetadata.monitorLocationDTONonLoadBasedIndicator.example,
    name:
      propertyMetadata.monitorLocationDTONonLoadBasedIndicator.fieldLabels
        .value,
  })
  @IsNotEmpty()
  @IsInRange(0, 1, {
    message: (args: ValidationArguments) => {
      return `The value of ${args.value} for ${args.property} must be within the range of 0 and 1 for ${KEY}.`;
    },
  })
  @ValidateIf(o => o.unitId !== null)
  nonLoadBasedIndicator: number;
}
