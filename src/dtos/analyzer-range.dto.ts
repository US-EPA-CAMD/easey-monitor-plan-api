import { ApiProperty } from '@nestjs/swagger';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';
import { IsInRange, IsIsoFormat } from '@us-epa-camd/easey-common/pipes';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  ValidateIf,
  ValidationArguments,
} from 'class-validator';
import { IsInDbValues } from '../import-checks/pipes/is-in-db-values.pipe';

export class AnalyzerRangeBaseDTO {
  @ApiProperty({
    description: propertyMetadata.analyzerRangeDTOAnalyzerRangeCode.description,
    example: propertyMetadata.analyzerRangeDTOAnalyzerRangeCode.example,
    name: propertyMetadata.analyzerRangeDTOAnalyzerRangeCode.fieldLabels.value,
  })
  @IsInDbValues(
    'SELECT analyzer_range_cd as "value" FROM camdecmpsmd.analyzer_range_code',
    {
      message: (args: ValidationArguments) => {
        return `${args.property} [ANALYZERRANGE-FATAL-B] The value : ${args.value} for ${args.property} is invalid`;
      },
    },
  )
  analyzerRangeCode: string;

  @ApiProperty({
    description:
      propertyMetadata.analyzerRangeDTODualRangeIndicator.description,
    example: propertyMetadata.analyzerRangeDTODualRangeIndicator.example,
    name: propertyMetadata.analyzerRangeDTODualRangeIndicator.fieldLabels.value,
  })
  @IsOptional()
  @IsInt()
  @IsInRange(0, 1, {
    message: (args: ValidationArguments) => {
      return `${args.property} [ANALYZERRANGE-FATAL-A] The value : ${args.value} for ${args.property} must be within the range of 0 and 1`;
    },
  })
  dualRangeIndicator: number;

  @ApiProperty({
    description: propertyMetadata.analyzerRangeDTOBeginDate.description,
    example: propertyMetadata.analyzerRangeDTOBeginDate.example,
    name: propertyMetadata.analyzerRangeDTOBeginDate.fieldLabels.value,
  })
  @IsOptional()
  @IsIsoFormat({
    message: (args: ValidationArguments) => {
      return `${args.property} [ANALYZERRANGE-FATAL-A] The value : ${args.value} for ${args.property} must be a valid ISO date format yyyy-mm-dd`;
    },
  })
  beginDate: Date;

  @ApiProperty({
    description: propertyMetadata.analyzerRangeDTOBeginHour.description,
    example: propertyMetadata.analyzerRangeDTOBeginHour.example,
    name: propertyMetadata.analyzerRangeDTOBeginHour.fieldLabels.value,
  })
  @IsOptional()
  @IsInt()
  @IsInRange(0, 23, {
    message: (args: ValidationArguments) => {
      return `${args.property} [ANALYZERRANGE-FATAL-A] The value : ${args.value} for ${args.property} must be within the range of 0 and 23`;
    },
  })
  beginHour: number;

  @ApiProperty({
    description: propertyMetadata.analyzerRangeDTOEndDate.description,
    example: propertyMetadata.analyzerRangeDTOEndDate.example,
    name: propertyMetadata.analyzerRangeDTOEndDate.fieldLabels.value,
  })
  @IsOptional()
  @IsIsoFormat({
    message: (args: ValidationArguments) => {
      return `${args.property} [ANALYZERRANGE-FATAL-A] The value : ${args.value} for ${args.property} must be a valid ISO date format yyyy-mm-dd`;
    },
  })
  @ValidateIf(o => o.endDate !== null)
  endDate: Date;

  @ApiProperty({
    description: propertyMetadata.analyzerRangeDTOEndHour.description,
    example: propertyMetadata.analyzerRangeDTOEndHour.example,
    name: propertyMetadata.analyzerRangeDTOEndHour.fieldLabels.value,
  })
  @IsOptional()
  @IsInt()
  @IsInRange(0, 23, {
    message: (args: ValidationArguments) => {
      return `${args.property} [ANALYZERRANGE-FATAL-A] The value : ${args.value} for ${args.property} must be within the range of 0 and 23`;
    },
  })
  @IsNotEmpty()
  @ValidateIf(o => o.endDate !== null)
  endHour: number;
}

export class AnalyzerRangeDTO extends AnalyzerRangeBaseDTO {
  @ApiProperty({
    description: propertyMetadata.analyzerRangeDTOId.description,
    example: propertyMetadata.analyzerRangeDTOId.example,
    name: propertyMetadata.analyzerRangeDTOId.fieldLabels.value,
  })
  id: string;

  @ApiProperty({
    description: propertyMetadata.analyzerRangeDTOComponentRecordId.description,
    example: propertyMetadata.analyzerRangeDTOComponentRecordId.example,
    name: propertyMetadata.analyzerRangeDTOComponentRecordId.fieldLabels.value,
  })
  componentRecordId: string;

  @ApiProperty({
    description: propertyMetadata.analyzerRangeDTOUserId.description,
    example: propertyMetadata.analyzerRangeDTOUserId.example,
    name: propertyMetadata.analyzerRangeDTOUserId.fieldLabels.value,
  })
  userId: string;

  @ApiProperty({
    description: propertyMetadata.analyzerRangeDTOAddDate.description,
    example: propertyMetadata.analyzerRangeDTOAddDate.example,
    name: propertyMetadata.analyzerRangeDTOAddDate.fieldLabels.value,
  })
  addDate: Date;

  @ApiProperty({
    description: propertyMetadata.analyzerRangeDTOUpdateDate.description,
    example: propertyMetadata.analyzerRangeDTOUpdateDate.example,
    name: propertyMetadata.analyzerRangeDTOUpdateDate.fieldLabels.value,
  })
  updateDate: Date;

  @ApiProperty({
    description: propertyMetadata.analyzerRangeDTOActive.description,
    example: propertyMetadata.analyzerRangeDTOActive.example,
    name: propertyMetadata.analyzerRangeDTOActive.fieldLabels.value,
  })
  active: boolean;
}
