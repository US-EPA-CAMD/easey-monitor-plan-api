import { ApiProperty } from '@nestjs/swagger';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';
import { IsNumber, ValidationArguments } from 'class-validator';
import { IsInRange } from '@us-epa-camd/easey-common/pipes';
import { IsAtMostYears } from '../import-checks/pipes/is-at-most-years.pipe';
import { IsInDbValues } from '../import-checks/pipes/is-in-db-values.pipe';
import { MatchesRegEx } from '../import-checks/pipes/matches-regex.pipe';

const qualDataTypeCodeQuery =
  'SELECT qual_data_type_cd as "value" FROM camdecmpsmd.qual_data_type_code';
export class PCTQualificationBaseDTO {
  @ApiProperty({
    description: propertyMetadata.year.description,
    example: propertyMetadata.year.example,
    name: 'qualificationYear',
  })
  @MatchesRegEx('^(19|20)([0-9]{2})$', {
    message: (args: ValidationArguments) => {
      return `${args.property} [QUALPCT-FATAL-A] The value for ${args.value} in the Qualification PCT record ${args.property} is not formatted properly`;
    },
  })
  qualificationYear: number;

  @ApiProperty({
    description:
      propertyMetadata.pCTQualificationDTOAveragePercentValue.description,
    example: propertyMetadata.pCTQualificationDTOAveragePercentValue.example,
    name:
      propertyMetadata.pCTQualificationDTOAveragePercentValue.fieldLabels.value,
  })
  @IsNumber(
    { maxDecimalPlaces: 1 },
    {
      message: (args: ValidationArguments) => {
        return `${args.property} [QUALPCT-FATAL-A] The value for ${args.value} in the Qualification PCT record ${args.property} is allowed only one decimal place`;
      },
    },
  )
  @IsInRange(-9999.9, 9999.9, {
    message: (args: ValidationArguments) => {
      return `${args.property} [QUALPCT-FATAL-A] The value for ${args.value} in the Qualification PCT record ${args.property} must be within the range of -9999.9 and 9999.9`;
    },
  })
  averagePercentValue: number;

  @ApiProperty({
    description:
      propertyMetadata.pCTQualificationDTOYr1QualificationDataYear.description,
    example:
      propertyMetadata.pCTQualificationDTOYr1QualificationDataYear.example,
    name:
      propertyMetadata.pCTQualificationDTOYr1QualificationDataYear.fieldLabels
        .value,
  })
  @IsAtMostYears(1940, 2050, {
    message: (args: ValidationArguments) => {
      return `${args.property} [QUALPCT-FATAL-A] The value for ${args.value} in the Qualification PCT record ${args.property} must be between 1940 and 2050`;
    },
  })
  yr1QualificationDataYear: number;

  @ApiProperty({
    description:
      propertyMetadata.pCTQualificationDTOYr1QualificationDataTypeCode
        .description,
    example:
      propertyMetadata.pCTQualificationDTOYr1QualificationDataTypeCode.example,
    name:
      propertyMetadata.pCTQualificationDTOYr1QualificationDataTypeCode
        .fieldLabels.value,
  })
  @IsInDbValues(qualDataTypeCodeQuery, {
    message: (args: ValidationArguments) => {
      return `${args.property} [QUALPCT-FATAL-B] The value for ${args.value} in the Qualification PCT record ${args.property} is invalid`;
    },
  })
  yr1QualificationDataTypeCode: string;

  @ApiProperty({
    description:
      propertyMetadata.pCTQualificationDTOYr1PercentageValue.description,
    example: propertyMetadata.pCTQualificationDTOYr1PercentageValue.example,
    name:
      propertyMetadata.pCTQualificationDTOYr1PercentageValue.fieldLabels.value,
  })
  @IsNumber(
    { maxDecimalPlaces: 1 },
    {
      message: (args: ValidationArguments) => {
        return `${args.property} [QUALPCT-FATAL-A] The value for ${args.value} in the Qualification PCT record ${args.property} is allowed only one decimal place`;
      },
    },
  )
  @IsInRange(-9999.9, 9999.9, {
    message: (args: ValidationArguments) => {
      return `${args.property} [QUALPCT-FATAL-A] The value for ${args.value} in the Qualification PCT record ${args.property} must be within the range of -9999.9 and 9999.9`;
    },
  })
  yr1PercentageValue: number;

  @ApiProperty({
    description:
      propertyMetadata.pCTQualificationDTOYr2QualificationDataYear.description,
    example:
      propertyMetadata.pCTQualificationDTOYr2QualificationDataYear.example,
    name:
      propertyMetadata.pCTQualificationDTOYr2QualificationDataYear.fieldLabels
        .value,
  })
  @IsAtMostYears(1940, 2050, {
    message: (args: ValidationArguments) => {
      return `${args.property} [QUALPCT-FATAL-A] The value for ${args.value} in the Qualification PCT record ${args.property} must be between 1940 and 2050`;
    },
  })
  yr2QualificationDataYear: number;

  @ApiProperty({
    description:
      propertyMetadata.pCTQualificationDTOYr2QualificationDataTypeCode
        .description,
    example:
      propertyMetadata.pCTQualificationDTOYr2QualificationDataTypeCode.example,
    name:
      propertyMetadata.pCTQualificationDTOYr2QualificationDataTypeCode
        .fieldLabels.value,
  })
  @IsInDbValues(qualDataTypeCodeQuery, {
    message: (args: ValidationArguments) => {
      return `${args.property} [QUALPCT-FATAL-B] The value for ${args.value} in the Qualification PCT record ${args.property} is invalid`;
    },
  })
  yr2QualificationDataTypeCode: string;

  @ApiProperty({
    description:
      propertyMetadata.pCTQualificationDTOYr2PercentageValue.description,
    example: propertyMetadata.pCTQualificationDTOYr2PercentageValue.example,
    name:
      propertyMetadata.pCTQualificationDTOYr2PercentageValue.fieldLabels.value,
  })
  @IsNumber(
    { maxDecimalPlaces: 1 },
    {
      message: (args: ValidationArguments) => {
        return `${args.property} [QUALPCT-FATAL-A] The value for ${args.value} in the Qualification PCT record ${args.property} is allowed only one decimal place`;
      },
    },
  )
  @IsInRange(-9999.9, 9999.9, {
    message: (args: ValidationArguments) => {
      return `${args.property} [QUALPCT-FATAL-A] The value for ${args.value} in the Qualification PCT record ${args.property} must be within the range of -9999.9 and 9999.9`;
    },
  })
  yr2PercentageValue: number;

  @ApiProperty({
    description:
      propertyMetadata.pCTQualificationDTOYr3QualificationDataYear.description,
    example:
      propertyMetadata.pCTQualificationDTOYr3QualificationDataYear.example,
    name:
      propertyMetadata.pCTQualificationDTOYr3QualificationDataYear.fieldLabels
        .value,
  })
  @IsAtMostYears(1940, 2050, {
    message: (args: ValidationArguments) => {
      return `${args.property} [QUALPCT-FATAL-A] The value for ${args.value} in the Qualification PCT record ${args.property} must be between 1940 and 2050`;
    },
  })
  yr3QualificationDataYear: number;

  @ApiProperty({
    description:
      propertyMetadata.pCTQualificationDTOYr3QualificationDataTypeCode
        .description,
    example:
      propertyMetadata.pCTQualificationDTOYr3QualificationDataTypeCode.example,
    name:
      propertyMetadata.pCTQualificationDTOYr3QualificationDataTypeCode
        .fieldLabels.value,
  })
  @IsInDbValues(qualDataTypeCodeQuery, {
    message: (args: ValidationArguments) => {
      return `${args.property} [QUALPCT-FATAL-B] The value for ${args.value} in the Qualification PCT record ${args.property} is invalid`;
    },
  })
  yr3QualificationDataTypeCode: string;

  @ApiProperty({
    description:
      propertyMetadata.pCTQualificationDTOYr3PercentageValue.description,
    example: propertyMetadata.pCTQualificationDTOYr3PercentageValue.example,
    name:
      propertyMetadata.pCTQualificationDTOYr3PercentageValue.fieldLabels.value,
  })
  @IsNumber(
    { maxDecimalPlaces: 1 },
    {
      message: (args: ValidationArguments) => {
        return `${args.property} [QUALPCT-FATAL-A] The value for ${args.value} in the Qualification PCT record ${args.property} is allowed only one decimal place`;
      },
    },
  )
  @IsInRange(-9999.9, 9999.9, {
    message: (args: ValidationArguments) => {
      return `${args.property} [QUALPCT-FATAL-A] The value for ${args.value} in the Qualification PCT record ${args.property} must be within the range of -9999.9 and 9999.9`;
    },
  })
  yr3PercentageValue: number;
}

export class PCTQualificationDTO extends PCTQualificationBaseDTO {
  @ApiProperty({
    description: propertyMetadata.pCTQualificationDTOId.description,
    example: propertyMetadata.pCTQualificationDTOId.example,
    name: propertyMetadata.pCTQualificationDTOId.fieldLabels.value,
  })
  id: string;

  @ApiProperty({
    description:
      propertyMetadata.pCTQualificationDTOQualificationId.description,
    example: propertyMetadata.pCTQualificationDTOQualificationId.example,
    name: propertyMetadata.pCTQualificationDTOQualificationId.fieldLabels.value,
  })
  qualificationId: string;

  @ApiProperty({
    description: propertyMetadata.pCTQualificationDTOUserId.description,
    example: propertyMetadata.pCTQualificationDTOUserId.example,
    name: propertyMetadata.pCTQualificationDTOUserId.fieldLabels.value,
  })
  userId: string;

  @ApiProperty({
    description: propertyMetadata.pCTQualificationDTOAddDate.description,
    example: propertyMetadata.pCTQualificationDTOAddDate.example,
    name: propertyMetadata.pCTQualificationDTOAddDate.fieldLabels.value,
  })
  addDate: Date;

  @ApiProperty({
    description: propertyMetadata.pCTQualificationDTOUpdateDate.description,
    example: propertyMetadata.pCTQualificationDTOUpdateDate.example,
    name: propertyMetadata.pCTQualificationDTOUpdateDate.fieldLabels.value,
  })
  updateDate: Date;
}
