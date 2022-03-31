import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, ValidationArguments } from 'class-validator';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';
import { IsInRange, IsIsoFormat } from '@us-epa-camd/easey-common/pipes';
import { IsInDbValues } from '../import-checks/pipes/is-in-db-values.pipe';

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
      return `${args.property} [QUALLEE-FATAL-A] The value for ${args.value} for ${args.property} must be a valid ISO date format yyyy-mm-dd`;
    },
  })
  qualificationTestDate: Date;

  @ApiProperty({
    description: propertyMetadata.lEEQualificationDTOParameterCode.description,
    example: propertyMetadata.lEEQualificationDTOParameterCode.example,
    name: propertyMetadata.lEEQualificationDTOParameterCode.fieldLabels.value,
  })
  @IsInDbValues(
    'SELECT distinct parameter_code FROM camdecmpsmd.vw_quallee_master_data_relationships',
    {
      message: (args: ValidationArguments) => {
        return `${args.property} [QUALLEE-FATAL-B] The value for ${args.value} in the Qualification LEE record ${args.property} is invalid`;
      },
    },
  )
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
    'SELECT distinct qual_lee_test_type_code FROM camdecmpsmd.vw_quallee_master_data_relationships',
    {
      message: (args: ValidationArguments) => {
        return `${args.property} [QUALLEE-FATAL-B] The value for ${args.value} in the Qualification LEE record ${args.property} is invalid`;
      },
    },
  )
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
  @IsNumber(
    { maxDecimalPlaces: 1 },
    {
      message: (args: ValidationArguments) => {
        return `${args.property} [QUALLEE-FATAL-A] The value for ${args.value} in the Qualification LEE record ${args.property} is allowed only one decimal place`;
      },
    },
  )
  @IsInRange(-9999.9, 9999.9, {
    message: (args: ValidationArguments) => {
      return `${args.property} [QUALLEE-FATAL-A] The value for ${args.value} in the Qualification LEE record ${args.property} must be within the range of -9999.9 and 9999.9`;
    },
  })
  potentialAnnualHgMassEmissions: number;

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
  @IsNumber(
    { maxDecimalPlaces: 4 },
    {
      message: (args: ValidationArguments) => {
        return `${args.property} [QUALLEE-FATAL-A] The value for ${args.value} in the Qualification LEE record ${args.property} is allowed only four decimal places`;
      },
    },
  )
  @IsInRange(-99999.9999, 99999.9999, {
    message: (args: ValidationArguments) => {
      return `${args.property} [QUALLEE-FATAL-A] The value for ${args.value} in the Qualification LEE record ${args.property} must be within the range of -99999.9999 and 99999.9999`;
    },
  })
  applicableEmissionStandard: number;

  @ApiProperty({
    description:
      propertyMetadata.lEEQualificationDTOUnitsOfStandard.description,
    example: propertyMetadata.lEEQualificationDTOUnitsOfStandard.example,
    name: propertyMetadata.lEEQualificationDTOUnitsOfStandard.fieldLabels.value,
  })
  @IsInDbValues(
    'SELECT distinct unit_of_standard_code FROM camdecmpsmd.vw_quallee_master_data_relationships',
    {
      message: (args: ValidationArguments) => {
        return `${args.property} [QUALLEE-FATAL-B] The value for ${args.value} in the Qualification LEE record ${args.property} is invalid`;
      },
    },
  )
  unitsOfStandard: string;

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
  @IsNumber(
    { maxDecimalPlaces: 1 },
    {
      message: (args: ValidationArguments) => {
        return `${args.property} [QUALLEE-FATAL-A] The value for ${args.value} in the Qualification LEE record ${args.property} is allowed only one decimal place`;
      },
    },
  )
  @IsInRange(-9999.9, 9999.9, {
    message: (args: ValidationArguments) => {
      return `${args.property} [QUALLEE-FATAL-A] The value for ${args.value} in the Qualification LEE record ${args.property} must be within the range of -9999.9 and 9999.9`;
    },
  })
  percentageOfEmissionStandard: number;
}
