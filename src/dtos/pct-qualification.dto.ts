import { ApiProperty } from '@nestjs/swagger';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidationArguments,
} from 'class-validator';
import { IsInRange } from '@us-epa-camd/easey-common/pipes';
import { IsInDbValues } from '../import-checks/pipes/is-in-db-values.pipe';

const KEY = 'Monitor Qualification Percentage';
const qualDataTypeCodeQuery =
  'SELECT qual_data_type_cd as "value" FROM camdecmpsmd.qual_data_type_code';
export class PCTQualificationBaseDTO {
  @ApiProperty({
    description: propertyMetadata.year.description,
    example: propertyMetadata.year.example,
    name: 'qualificationYear',
  })
  @IsNotEmpty()
  @IsInt()
  @IsInRange(1900, 2099, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be within the range of 1900 and 2099.`;
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
  @IsOptional()
  @IsInt()
  @IsInRange(0, 100, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be in the range of 0 and 100 for [${KEY}].`;
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
  @IsOptional()
  @IsInt()
  @IsInRange(1940, 2050, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be between 1940 and 2050 for [${KEY}]`;
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
  @IsOptional()
  @IsString()
  @IsInDbValues(qualDataTypeCodeQuery, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] is invalid for [${KEY}].`;
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
  @IsOptional()
  @IsInt()
  @IsInRange(0, 100, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be in the range of 0 and 100 for [${KEY}].`;
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
  @IsOptional()
  @IsInt()
  @IsInRange(1940, 2050, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be between 1940 and 2050 for [${KEY}]`;
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
  @IsOptional()
  @IsString()
  @IsInDbValues(qualDataTypeCodeQuery, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] is invalid for [${KEY}].`;
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
  @IsOptional()
  @IsInt()
  @IsInRange(0, 100, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be in the range of 0 and 100 for [${KEY}].`;
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
  @IsOptional()
  @IsInt()
  @IsInRange(1940, 2050, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be between 1940 and 2050 for [${KEY}]`;
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
  @IsOptional()
  @IsString()
  @IsInDbValues(qualDataTypeCodeQuery, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] is invalid for [${KEY}].`;
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
  @IsOptional()
  @IsInt()
  @IsInRange(0, 100, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be in the range of 0 and 100 for [${KEY}].`;
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
  @IsString()
  id: string;

  @ApiProperty({
    description:
      propertyMetadata.pCTQualificationDTOQualificationId.description,
    example: propertyMetadata.pCTQualificationDTOQualificationId.example,
    name: propertyMetadata.pCTQualificationDTOQualificationId.fieldLabels.value,
  })
  @IsString()
  qualificationId: string;

  @ApiProperty({
    description: propertyMetadata.pCTQualificationDTOUserId.description,
    example: propertyMetadata.pCTQualificationDTOUserId.example,
    name: propertyMetadata.pCTQualificationDTOUserId.fieldLabels.value,
  })
  @IsString()
  userId: string;

  @ApiProperty({
    description: propertyMetadata.pCTQualificationDTOAddDate.description,
    example: propertyMetadata.pCTQualificationDTOAddDate.example,
    name: propertyMetadata.pCTQualificationDTOAddDate.fieldLabels.value,
  })
  @IsDateString()
  addDate: string;

  @ApiProperty({
    description: propertyMetadata.pCTQualificationDTOUpdateDate.description,
    example: propertyMetadata.pCTQualificationDTOUpdateDate.example,
    name: propertyMetadata.pCTQualificationDTOUpdateDate.fieldLabels.value,
  })
  @IsDateString()
  @IsOptional()
  updateDate: string;
}
