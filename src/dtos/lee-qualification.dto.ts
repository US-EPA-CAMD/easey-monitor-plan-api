import { ApiProperty } from '@nestjs/swagger';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidationArguments,
} from 'class-validator';
import { IsInRange, IsIsoFormat } from '@us-epa-camd/easey-common/pipes';
import { IsInDbValues } from '../import-checks/pipes/is-in-db-values.pipe';

const KEY = 'Monitor Qualification LEE';

export class LEEQualificationBaseDTO {
  @ApiProperty({
    description:
      propertyMetadata.lEEQualificationDTOQualificationTestDate.description,
    example: propertyMetadata.lEEQualificationDTOQualificationTestDate.example,
    name:
      propertyMetadata.lEEQualificationDTOQualificationTestDate.fieldLabels
        .value,
  })
  @IsNotEmpty()
  @IsIsoFormat({
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be a valid ISO date format [YYYY-MM-DD]`;
    },
  })
  qualificationTestDate: Date;

  @ApiProperty({
    description: propertyMetadata.lEEQualificationDTOParameterCode.description,
    example: propertyMetadata.lEEQualificationDTOParameterCode.example,
    name: propertyMetadata.lEEQualificationDTOParameterCode.fieldLabels.value,
  })
  @IsInDbValues(
    'SELECT distinct parameter_code as "value" FROM camdecmpsmd.vw_quallee_master_data_relationships',
    {
      message: (args: ValidationArguments) => {
        return `The value of [${args.value}] for [${args.property}] is invalid for [${KEY}]`;
      },
    },
  )
  @IsString()
  parameterCode: string;

  @ApiProperty({
    description:
      propertyMetadata.lEEQualificationDTOQualificationTestType.description,
    example: propertyMetadata.lEEQualificationDTOQualificationTestType.example,
    name:
      propertyMetadata.lEEQualificationDTOQualificationTestType.fieldLabels
        .value,
  })
  @IsInDbValues(
    'SELECT distinct qual_lee_test_type_cd as "value" FROM camdecmpsmd.vw_quallee_master_data_relationships',
    {
      message: (args: ValidationArguments) => {
        return `The value of [${args.value}] for [${args.property}] is invalid for [${KEY}]`;
      },
    },
  )
  @IsString()
  qualificationTestType: string;

  @ApiProperty({
    description:
      propertyMetadata.lEEQualificationDTOPotentialAnnualMassEmissions
        .description,
    example:
      propertyMetadata.lEEQualificationDTOPotentialAnnualMassEmissions.example,
    name:
      propertyMetadata.lEEQualificationDTOPotentialAnnualMassEmissions
        .fieldLabels.value,
  })
  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 1 },
    {
      message: (args: ValidationArguments) => {
        return `The value of [${args.value}] for [${args.property}] is allowed only one decimal place for [${KEY}]`;
      },
    },
  )
  @IsInRange(0, 9999.9, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be within the range of 0 and 9999.9 for [${KEY}]`;
    },
  })
  potentialAnnualMassEmissions: number;

  @ApiProperty({
    description:
      propertyMetadata.lEEQualificationDTOApplicableEmissionStandard
        .description,
    example:
      propertyMetadata.lEEQualificationDTOApplicableEmissionStandard.example,
    name:
      propertyMetadata.lEEQualificationDTOApplicableEmissionStandard.fieldLabels
        .value,
  })
  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 4 },
    {
      message: (args: ValidationArguments) => {
        return `The value of [${args.value}] for [${args.property}] is allowed only four decimal places for [${KEY}]`;
      },
    },
  )
  @IsInRange(0, 99999.9999, {
    message: (args: ValidationArguments) => {
      return `The value for [${args.value}] in the Qualification LEE record [${args.property}] must be within the range of 0 and 99999.9999`;
    },
  })
  applicableEmissionStandard: number;

  @ApiProperty({
    description:
      propertyMetadata.lEEQualificationDTOUnitsOfStandard.description,
    example: propertyMetadata.lEEQualificationDTOUnitsOfStandard.example,
    name: propertyMetadata.lEEQualificationDTOUnitsOfStandard.fieldLabels.value,
  })
  @IsOptional()
  @IsInDbValues(
    'SELECT distinct unit_of_standard_code as "value" FROM camdecmpsmd.vw_quallee_master_data_relationships',
    {
      message: (args: ValidationArguments) => {
        return `The value of [${args.value}] for [${args.property}] is invalid for [${KEY}]`;
      },
    },
  )
  @IsString()
  unitsofStandard: string;

  @ApiProperty({
    description:
      propertyMetadata.lEEQualificationDTOPercentageOfEmissionStandard
        .description,
    example:
      propertyMetadata.lEEQualificationDTOPercentageOfEmissionStandard.example,
    name:
      propertyMetadata.lEEQualificationDTOPercentageOfEmissionStandard
        .fieldLabels.value,
  })
  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 1 },
    {
      message: (args: ValidationArguments) => {
        return `The value of [${args.value}] for [${args.property}] is allowed only one decimal place for [${KEY}]`;
      },
    },
  )
  @IsInRange(0, 9999.9, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be within the range of 0 and 9999.9 for [${KEY}]`;
    },
  })
  percentageOfEmissionStandard: number;
}

export class LEEQualificationDTO extends LEEQualificationBaseDTO {
  @ApiProperty({
    description: propertyMetadata.lEEQualificationDTOId.description,
    example: propertyMetadata.lEEQualificationDTOId.example,
    name: propertyMetadata.lEEQualificationDTOId.fieldLabels.value,
  })
  @IsString()
  id: string;

  @ApiProperty({
    description:
      propertyMetadata.lEEQualificationDTOQualificationId.description,
    example: propertyMetadata.lEEQualificationDTOQualificationId.example,
    name: propertyMetadata.lEEQualificationDTOQualificationId.fieldLabels.value,
  })
  @IsString()
  qualificationId: string;

  @ApiProperty({
    description: propertyMetadata.lEEQualificationDTOUserId.description,
    example: propertyMetadata.lEEQualificationDTOUserId.example,
    name: propertyMetadata.lEEQualificationDTOUserId.fieldLabels.value,
  })
  @IsString()
  userId: string;

  @ApiProperty({
    description: propertyMetadata.lEEQualificationDTOAddDate.description,
    example: propertyMetadata.lEEQualificationDTOAddDate.example,
    name: propertyMetadata.lEEQualificationDTOAddDate.fieldLabels.value,
  })
  @IsDateString()
  addDate: string;

  @ApiProperty({
    description: propertyMetadata.lEEQualificationDTOUpdateDate.description,
    example: propertyMetadata.lEEQualificationDTOUpdateDate.example,
    name: propertyMetadata.lEEQualificationDTOUpdateDate.fieldLabels.value,
  })
  @IsOptional()
  @IsDateString()
  updateDate: string;
}
