import { ApiProperty } from '@nestjs/swagger';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';
import { IsInRange, IsIsoFormat } from '@us-epa-camd/easey-common/pipes';
import { IsInt, ValidationArguments } from 'class-validator';

export class AnalyzerRangeBaseDTO {
  @ApiProperty({
    description: propertyMetadata.analyzerRangeDTOAnalyzerRangeCode.description,
    example: propertyMetadata.analyzerRangeDTOAnalyzerRangeCode.example,
    name: propertyMetadata.analyzerRangeDTOAnalyzerRangeCode.fieldLabels.value,
  })
  analyzerRangeCode: string;

  @ApiProperty({
    description:
      propertyMetadata.analyzerRangeDTODualRangeIndicator.description,
    example: propertyMetadata.analyzerRangeDTODualRangeIndicator.example,
    name: propertyMetadata.analyzerRangeDTODualRangeIndicator.fieldLabels.value,
  })
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
  @IsIsoFormat()
  endDate: Date;

  @ApiProperty({
    description: propertyMetadata.analyzerRangeDTOEndHour.description,
    example: propertyMetadata.analyzerRangeDTOEndHour.example,
    name: propertyMetadata.analyzerRangeDTOEndHour.fieldLabels.value,
  })
  @IsInt()
  @IsInRange(0, 23, {
    message: (args: ValidationArguments) => {
      return `${args.property} [ANALYZERRANGE-FATAL-A] The value : ${args.value} for ${args.property} must be within the range of 0 and 23`;
    },
  })
  endHour: number;
}
