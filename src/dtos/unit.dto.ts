import { ApiProperty } from '@nestjs/swagger';
import {
  DATE_FORMAT,
  propertyMetadata,
} from '@us-epa-camd/easey-common/constants';
import {
  IsInRange,
  IsIsoFormat,
  IsValidDate,
  MatchesRegEx,
} from '@us-epa-camd/easey-common/pipes';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
  ValidationArguments,
} from 'class-validator';

const KEY = 'Unit';

export class UnitDTO {
  @IsNumber()
  @ApiProperty({
    description: propertyMetadata.unit.id.description,
    example: propertyMetadata.unit.id.example,
    name: propertyMetadata.unit.id.fieldLabels.value,
  })
  id: number;

  @IsString()
  @MatchesRegEx('^[A-z0-9\\-\\*#]{1,6}$', {
    message: (args: ValidationArguments) => {
      return `The value [${args.value}] for [${args.property}] must be match the RegEx: [A-Za-z0-9-*#]{1,6} for [${KEY}].`;
    },
  })
  @ApiProperty({
    description: propertyMetadata.unitId.description,
    example: propertyMetadata.unitId.example,
    name: propertyMetadata.unitId.fieldLabels.value,
  })
  unitId: string;

  @IsNumber()
  @ApiProperty({
    description: propertyMetadata.facilityId.description,
    example: propertyMetadata.facilityId.example,
    name: propertyMetadata.facilityId.fieldLabels.value,
  })
  facilityId: number;

  @ApiProperty({
    description: propertyMetadata.monitorQualificationDTOBeginDate.description,
    example: propertyMetadata.monitorQualificationDTOBeginDate.example,
    name: propertyMetadata.monitorQualificationDTOBeginDate.fieldLabels.value,
  })
  @IsNotEmpty()
  @IsIsoFormat({
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be a valid ISO date format [YYYY-MM-DD]`;
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
    description: propertyMetadata.monitorQualificationDTOEndDate.description,
    example: propertyMetadata.monitorQualificationDTOEndDate.example,
    name: propertyMetadata.monitorQualificationDTOEndDate.fieldLabels.value,
  })
  @ValidateIf(o => o.endDate !== null)
  @IsIsoFormat({
    message: (args: ValidationArguments) => {
      return `The value for [${args.value}] for [${args.property}] must be a valid ISO date format [YYYY-MM-DD]`;
    },
  })
  @IsValidDate({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatMessage(
        `[${args.property}] must be a valid date in the format of ${DATE_FORMAT}. You reported an invalid date of [${args.value}]`,
      );
    },
  })
  endDate: Date;

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
